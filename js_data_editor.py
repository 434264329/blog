# -*- coding: utf-8 -*-
"""
JS Data File Visual Editor
可视化编辑以 data 结尾的 JS 数据文件
支持: quick-links-data.js, resources-data.js, software-data.js
"""

import tkinter as tk
from tkinter import ttk, messagebox, colorchooser
import re
import json
import os
import copy

# ============== 配置 ==============
JS_DIR = r"G:\New_Desktop\project\web\web_bolg\js"
FILE_CONFIGS = {
    "quick-links-data.js": {
        "var_name": "quickLinksData",
        "type": "array",
        "label": "常用链接",
        "icon": "🔗"
    },
    "resources-data.js": {
        "var_name": "resourcesData",
        "type": "object_array",
        "label": "资源数据",
        "icon": "📦"
    },
    "software-data.js": {
        "var_name": "softwareData",
        "type": "array",
        "label": "软件数据",
        "icon": "💾"
    }
}

# ============== 工具函数 ==============

def _js_to_json(js_str):
    """将JS对象/数组语法转换为合法的JSON（逐字符解析）"""
    result = []
    i = 0
    n = len(js_str)

    while i < n:
        ch = js_str[i]

        # 单行注释（不在字符串内）
        if ch == '/' and i + 1 < n and js_str[i+1] == '/':
            while i < n and js_str[i] != '\n':
                i += 1
            continue

        # 多行注释
        if ch == '/' and i + 1 < n and js_str[i+1] == '*':
            i += 2
            while i < n - 1 and not (js_str[i] == '*' and js_str[i+1] == '/'):
                i += 1
            i += 2
            continue

        # 跳过空白
        if ch in ' \t\r\n':
            result.append(ch)
            i += 1
            continue

        # 单引号字符串 -> 双引号
        if ch == "'":
            i += 1
            chars = []
            while i < n and js_str[i] != "'":
                if js_str[i] == '\\' and i + 1 < n:
                    chars.append(js_str[i])
                    chars.append(js_str[i+1])
                    i += 2
                else:
                    if js_str[i] == '"':
                        chars.append('\\"')
                    else:
                        chars.append(js_str[i])
                    i += 1
            result.append('"')
            result.append(''.join(chars))
            result.append('"')
            i += 1
            continue

        # 双引号字符串（原样保留）
        if ch == '"':
            i += 1
            result.append('"')
            while i < n and js_str[i] != '"':
                if js_str[i] == '\\' and i + 1 < n:
                    result.append(js_str[i])
                    result.append(js_str[i+1])
                    i += 2
                else:
                    result.append(js_str[i])
                    i += 1
            result.append('"')
            i += 1
            continue

        # 无引号的属性名（在 { 或 , 之后，后面跟 :）
        if ch.isalpha() or ch == '_':
            word_start = i
            while i < n and (js_str[i].isalnum() or js_str[i] == '_'):
                i += 1
            word = js_str[word_start:i]
            # 检查是否是属性名（后面跟 : 且前面是 { 或 , 或空白）
            rest = js_str[i:].lstrip()
            if rest and rest[0] == ':':
                before = ''.join(result).rstrip()
                if before and before[-1] in '{,':
                    result.append('"')
                    result.append(word)
                    result.append('"')
                    continue
            result.append(word)
            continue

        # 移除尾逗号：, 后面跟着 } 或 ]
        if ch == ',':
            rest = js_str[i+1:].lstrip()
            if rest and rest[0] in '}]':
                i += 1
                continue

        result.append(ch)
        i += 1

    return ''.join(result)


def _extract_block(content, start_pos):
    """从start_pos开始提取一个完整的 [...] 或 {...} 块（括号匹配）"""
    if start_pos >= len(content):
        return None
    open_ch = content[start_pos]
    if open_ch not in '[{':
        return None
    close_ch = ']' if open_ch == '[' else '}'
    depth = 0
    i = start_pos
    in_string = False
    string_char = None
    while i < len(content):
        c = content[i]
        if in_string:
            if c == '\\' and i + 1 < len(content):
                i += 2
                continue
            if c == string_char:
                in_string = False
        else:
            if c in '"\'':
                in_string = True
                string_char = c
            elif c == open_ch:
                depth += 1
            elif c == close_ch:
                depth -= 1
                if depth == 0:
                    return content[start_pos:i+1]
        i += 1
    return None


def parse_js_file(filepath, var_name, data_type):
    """从JS文件中解析数据"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 找到 const varName = 后面的位置
    pattern = rf'const\s+{var_name}\s*=\s*'
    match = re.search(pattern, content)
    if not match:
        return []

    start_pos = match.end()
    # 提取完整的块
    block = _extract_block(content, start_pos)
    if not block:
        return []

    json_str = _js_to_json(block)

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        return []

    if data_type == "object_array":
        return data.get("resources", [])
    return data


def save_js_file(filepath, var_name, data, data_type, original_content=None):
    """保存数据回JS文件"""
    # 格式化JSON
    json_str = json.dumps(data, ensure_ascii=False, indent=4)

    if data_type == "object_array":
        # 包装成 { "resources": [...] } 格式
        wrapper = {"resources": data}
        json_str = json.dumps(wrapper, ensure_ascii=False, indent=4)
        new_content = f"// 资源数据\nconst {var_name} = {json_str};\n\n// 确保数据在全局作用域中可用\nwindow.{var_name} = {var_name};\n\nconsole.log('资源数据已加载:', {var_name});\n"
    else:
        # 提取原文件的注释头
        comment = "// 常用网站数据配置\n" if "quick" in filepath else "// 软件数据配置\n"
        # 处理尾逗号风格（保持原风格）
        json_lines = json_str.split('\n')
        formatted_lines = []
        for i, line in enumerate(json_lines):
            if i < len(json_lines) - 1 and line.rstrip().endswith('}'):
                next_line = json_lines[i+1].strip() if i+1 < len(json_lines) else ''
                if next_line and next_line[0] in '],':
                    formatted_lines.append(line + ',')
                    continue
            formatted_lines.append(line)
        json_str = '\n'.join(formatted_lines)
        new_content = f"{comment}const {var_name} = {json_str};\n"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True


def create_default_item(file_key):
    """创建默认的新条目"""
    if file_key == "quick-links-data.js":
        return {
            "id": "new_item",
            "name": "新链接",
            "description": "描述",
            "url": "https://",
            "icon": {
                "type": "text",
                "content": "N",
                "gradient": "linear-gradient(135deg, #4f46e5, #7c3aed)"
            }
        }
    elif file_key == "resources-data.js":
        return {
            "id": 0,
            "title": "新资源",
            "name": "进入网站",
            "description": "描述",
            "url": "https://",
            "icon": "tool"
        }
    else:
        return {
            "id": "new_item",
            "title": "新软件",
            "description": "描述",
            "version": "1.0",
            "size": "0 MB",
            "downloads": [{"name": "下载链接", "url": "https://", "type": "exe"}],
            "icon": "",
            "category": "工具"
        }


# ============== 主应用 ==============

class DataEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("JS 数据文件编辑器")
        self.root.geometry("1200x750")
        self.root.minsize(1000, 600)

        # 数据存储
        self.current_file = None
        self.current_data = []
        self.original_data = []
        self.is_modified = False
        self.current_item_index = -1

        # 配色
        self.colors = {
            "bg": "#f0f2f5",
            "sidebar": "#ffffff",
            "accent": "#4f46e5",
            "accent_hover": "#4338ca",
            "danger": "#ef4444",
            "success": "#22c55e",
            "text": "#1f2937",
            "text_light": "#6b7280",
            "border": "#e5e7eb",
            "selected": "#eef2ff",
            "item_bg": "#ffffff"
        }

        self.root.configure(bg=self.colors["bg"])

        self._setup_styles()
        self._create_widgets()
        self._load_file_list()

    def _setup_styles(self):
        """配置ttk样式"""
        style = ttk.Style()
        style.theme_use('clam')

        style.configure('Sidebar.TFrame', background=self.colors["sidebar"])
        style.configure('Main.TFrame', background=self.colors["bg"])
        style.configure('Card.TFrame', background=self.colors["item_bg"], relief='flat')

        style.configure('Title.TLabel',
                        background=self.colors["sidebar"],
                        foreground=self.colors["text"],
                        font=('Microsoft YaHei UI', 14, 'bold'))

        style.configure('Subtitle.TLabel',
                        background=self.colors["sidebar"],
                        foreground=self.colors["text_light"],
                        font=('Microsoft YaHei UI', 9))

        style.configure('File.TButton',
                        background=self.colors["item_bg"],
                        foreground=self.colors["text"],
                        font=('Microsoft YaHei UI', 10),
                        padding=(12, 8))

        style.configure('Accent.TButton',
                        background=self.colors["accent"],
                        foreground='white',
                        font=('Microsoft YaHei UI', 10, 'bold'),
                        padding=(16, 8))

        style.configure('Danger.TButton',
                        background=self.colors["danger"],
                        foreground='white',
                        font=('Microsoft YaHei UI', 10),
                        padding=(12, 6))

        style.configure('Success.TButton',
                        background=self.colors["success"],
                        foreground='white',
                        font=('Microsoft YaHei UI', 10, 'bold'),
                        padding=(16, 8))

        style.configure('Item.TLabel',
                        background=self.colors["item_bg"],
                        foreground=self.colors["text"],
                        font=('Microsoft YaHei UI', 10))

        style.configure('ItemDesc.TLabel',
                        background=self.colors["item_bg"],
                        foreground=self.colors["text_light"],
                        font=('Microsoft YaHei UI', 8))

    def _create_widgets(self):
        """创建主界面"""
        # 主容器
        main_frame = ttk.Frame(self.root, style='Main.TFrame')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # 左侧面板 (文件选择 + 条目列表)
        left_panel = tk.Frame(main_frame, bg=self.colors["sidebar"],
                              width=280, relief='flat', bd=0,
                              highlightbackground=self.colors["border"],
                              highlightthickness=1)
        left_panel.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_panel.pack_propagate(False)

        # 标题
        header_frame = tk.Frame(left_panel, bg=self.colors["sidebar"])
        header_frame.pack(fill=tk.X, padx=15, pady=(15, 5))
        ttk.Label(header_frame, text="📁 数据文件编辑器",
                  style='Title.TLabel').pack(anchor='w')
        ttk.Label(header_frame, text="选择文件开始编辑",
                  style='Subtitle.TLabel').pack(anchor='w', pady=(2, 0))

        # 分隔线
        tk.Frame(left_panel, bg=self.colors["border"], height=1).pack(fill=tk.X, padx=15, pady=10)

        # 文件选择区
        file_frame = tk.Frame(left_panel, bg=self.colors["sidebar"])
        file_frame.pack(fill=tk.X, padx=15, pady=(0, 10))

        ttk.Label(file_frame, text="选择数据文件",
                  background=self.colors["sidebar"],
                  foreground=self.colors["text_light"],
                  font=('Microsoft YaHei UI', 9)).pack(anchor='w', pady=(0, 5))

        self.file_buttons = {}
        for fname, config in FILE_CONFIGS.items():
            btn_frame = tk.Frame(file_frame, bg=self.colors["item_bg"],
                                relief='flat', bd=0,
                                highlightbackground=self.colors["border"],
                                highlightthickness=1,
                                cursor='hand2')
            btn_frame.pack(fill=tk.X, pady=2)

            icon_label = tk.Label(btn_frame, text=config["icon"],
                                 bg=self.colors["item_bg"],
                                 font=('Segoe UI Emoji', 16))
            icon_label.pack(side=tk.LEFT, padx=(10, 5), pady=8)

            text_frame = tk.Frame(btn_frame, bg=self.colors["item_bg"])
            text_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, pady=8)

            name_label = tk.Label(text_frame, text=config["label"],
                                 bg=self.colors["item_bg"],
                                 fg=self.colors["text"],
                                 font=('Microsoft YaHei UI', 10, 'bold'),
                                 anchor='w')
            name_label.pack(fill=tk.X)

            file_label = tk.Label(text_frame, text=fname,
                                 bg=self.colors["item_bg"],
                                 fg=self.colors["text_light"],
                                 font=('Consolas', 8),
                                 anchor='w')
            file_label.pack(fill=tk.X)

            # 绑定点击事件
            for widget in [btn_frame, icon_label, text_frame, name_label, file_label]:
                widget.bind('<Button-1>', lambda e, f=fname: self._select_file(f))
                widget.bind('<Enter>', lambda e, f=btn_frame: f.configure(bg=self.colors["selected"]))
                widget.bind('<Leave>', lambda e, f=btn_frame, n=fname: self._on_leave_file_btn(f, n))

            self.file_buttons[fname] = btn_frame

        # 分隔线
        tk.Frame(left_panel, bg=self.colors["border"], height=1).pack(fill=tk.X, padx=15, pady=10)

        # 条目列表区
        list_header = tk.Frame(left_panel, bg=self.colors["sidebar"])
        list_header.pack(fill=tk.X, padx=15, pady=(0, 5))

        ttk.Label(list_header, text="数据条目",
                  background=self.colors["sidebar"],
                  foreground=self.colors["text"],
                  font=('Microsoft YaHei UI', 11, 'bold')).pack(side=tk.LEFT)

        self.item_count_label = ttk.Label(list_header, text="",
                                          background=self.colors["sidebar"],
                                          foreground=self.colors["text_light"],
                                          font=('Microsoft YaHei UI', 9))
        self.item_count_label.pack(side=tk.RIGHT)

        # 条目列表 (使用Canvas+Frame实现滚动)
        list_container = tk.Frame(left_panel, bg=self.colors["sidebar"])
        list_container.pack(fill=tk.BOTH, expand=True, padx=15, pady=(0, 15))

        self.item_canvas = tk.Canvas(list_container, bg=self.colors["sidebar"],
                                     highlightthickness=0, bd=0)
        scrollbar = ttk.Scrollbar(list_container, orient=tk.VERTICAL,
                                  command=self.item_canvas.yview)
        self.item_list_frame = tk.Frame(self.item_canvas, bg=self.colors["sidebar"])

        self.item_list_frame.bind("<Configure>",
                                  lambda e: self.item_canvas.configure(scrollregion=self.item_canvas.bbox("all")))
        self.item_canvas.create_window((0, 0), window=self.item_list_frame, anchor="nw")
        self.item_canvas.configure(yscrollcommand=scrollbar.set)

        self.item_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # 绑定鼠标滚轮
        self.item_canvas.bind_all("<MouseWheel>",
                                  lambda e: self.item_canvas.yview_scroll(int(-1*(e.delta/120)), "units"))

        # 右侧编辑区
        right_panel = tk.Frame(main_frame, bg=self.colors["bg"])
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # 编辑区标题栏
        edit_header = tk.Frame(right_panel, bg=self.colors["bg"])
        edit_header.pack(fill=tk.X, pady=(0, 10))

        self.edit_title = tk.Label(edit_header, text="请先选择一个数据文件",
                                   bg=self.colors["bg"],
                                   fg=self.colors["text"],
                                   font=('Microsoft YaHei UI', 14, 'bold'))
        self.edit_title.pack(side=tk.LEFT)

        self.save_btn = tk.Button(edit_header, text="💾 保存修改",
                                  bg=self.colors["success"],
                                  fg='white',
                                  font=('Microsoft YaHei UI', 10, 'bold'),
                                  relief='flat', bd=0,
                                  padx=20, pady=8,
                                  cursor='hand2',
                                  command=self._save_current_item)
        self.save_btn.pack(side=tk.RIGHT, padx=5)
        self.save_btn.pack_forget()  # 初始隐藏

        # 添加/删除按钮栏
        self.action_bar = tk.Frame(right_panel, bg=self.colors["bg"])
        self.action_bar.pack(fill=tk.X, pady=(0, 10))

        self.add_btn = tk.Button(self.action_bar, text="➕ 添加条目",
                                 bg=self.colors["accent"],
                                 fg='white',
                                 font=('Microsoft YaHei UI', 10),
                                 relief='flat', bd=0,
                                 padx=15, pady=6,
                                 cursor='hand2',
                                 command=self._add_item)
        self.add_btn.pack(side=tk.LEFT, padx=(0, 5))

        self.duplicate_btn = tk.Button(self.action_bar, text="📋 复制条目",
                                       bg=self.colors["accent"],
                                       fg='white',
                                       font=('Microsoft YaHei UI', 10),
                                       relief='flat', bd=0,
                                       padx=15, pady=6,
                                       cursor='hand2',
                                       command=self._duplicate_item)
        self.duplicate_btn.pack(side=tk.LEFT, padx=(0, 5))

        self.delete_btn = tk.Button(self.action_bar, text="🗑️ 删除条目",
                                    bg=self.colors["danger"],
                                    fg='white',
                                    font=('Microsoft YaHei UI', 10),
                                    relief='flat', bd=0,
                                    padx=15, pady=6,
                                    cursor='hand2',
                                    command=self._delete_item)
        self.delete_btn.pack(side=tk.LEFT)
        self.action_bar.pack_forget()  # 初始隐藏

        # 编辑内容区 (可滚动)
        edit_container = tk.Frame(right_panel, bg=self.colors["item_bg"],
                                  highlightbackground=self.colors["border"],
                                  highlightthickness=1)
        edit_container.pack(fill=tk.BOTH, expand=True)

        self.edit_canvas = tk.Canvas(edit_container, bg=self.colors["item_bg"],
                                     highlightthickness=0, bd=0)
        edit_scrollbar = ttk.Scrollbar(edit_container, orient=tk.VERTICAL,
                                       command=self.edit_canvas.yview)
        self.edit_frame = tk.Frame(self.edit_canvas, bg=self.colors["item_bg"])

        self.edit_frame.bind("<Configure>",
                             lambda e: self.edit_canvas.configure(scrollregion=self.edit_canvas.bbox("all")))
        self.edit_canvas.create_window((0, 0), window=self.edit_frame, anchor="nw",
                                       tags="edit_window")
        self.edit_canvas.configure(yscrollcommand=edit_scrollbar.set)

        self.edit_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=20)
        edit_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # 绑定编辑区滚轮
        self.edit_canvas.bind_all("<MouseWheel>",
                                  lambda e: self.edit_canvas.yview_scroll(int(-1*(e.delta/120)), "units"))

        # 初始提示
        self._show_placeholder()

        # 窗口大小变化时调整编辑区宽度
        self.edit_canvas.bind('<Configure>', self._on_canvas_resize)

    def _on_canvas_resize(self, event):
        """调整编辑区宽度"""
        self.edit_canvas.itemconfig("edit_window", width=event.width - 40)

    def _on_leave_file_btn(self, btn, fname):
        """鼠标离开文件按钮"""
        if self.current_file != fname:
            btn.configure(bg=self.colors["item_bg"])

    def _show_placeholder(self):
        """显示占位提示"""
        for widget in self.edit_frame.winfo_children():
            widget.destroy()

        placeholder = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        placeholder.pack(expand=True, fill=tk.BOTH)

        tk.Label(placeholder, text="📝",
                 bg=self.colors["item_bg"],
                 font=('Segoe UI Emoji', 48)).pack(pady=(100, 20))
        tk.Label(placeholder, text="请从左侧选择数据文件",
                 bg=self.colors["item_bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 16, 'bold')).pack()
        tk.Label(placeholder, text="然后选择条目进行编辑",
                 bg=self.colors["item_bg"],
                 fg=self.colors["text_light"],
                 font=('Microsoft YaHei UI', 11)).pack(pady=(5, 0))

    def _load_file_list(self):
        """加载文件列表"""
        pass  # 文件列表已在创建时静态生成

    def _select_file(self, fname):
        """选择文件"""
        # 检查未保存
        if self.is_modified:
            if not messagebox.askyesno("未保存", "当前修改未保存，确定要切换文件吗？"):
                return

        # 更新按钮样式
        for fn, btn in self.file_buttons.items():
            if fn == fname:
                btn.configure(bg=self.colors["selected"],
                             highlightbackground=self.colors["accent"])
            else:
                btn.configure(bg=self.colors["item_bg"],
                             highlightbackground=self.colors["border"])

        self.current_file = fname
        config = FILE_CONFIGS[fname]
        filepath = os.path.join(JS_DIR, fname)

        # 解析数据
        try:
            self.current_data = parse_js_file(filepath, config["var_name"], config["type"])
            self.original_data = copy.deepcopy(self.current_data)
        except Exception as e:
            messagebox.showerror("错误", f"解析文件失败：{str(e)}")
            return

        # 更新标题
        self.edit_title.configure(text=f"{config['icon']} {config['label']}")
        self.is_modified = False

        # 显示操作栏
        self.action_bar.pack(fill=tk.X, pady=(0, 10), before=self.edit_canvas.master)

        # 刷新条目列表
        self._refresh_item_list()

        # 显示第一个条目或占位
        if self.current_data:
            self._select_item(0)
        else:
            self._show_empty_hint()

    def _refresh_item_list(self):
        """刷新条目列表"""
        for widget in self.item_list_frame.winfo_children():
            widget.destroy()

        self.item_count_label.configure(text=f"共 {len(self.current_data)} 条")

        for i, item in enumerate(self.current_data):
            self._create_item_card(i, item)

    def _create_item_card(self, index, item):
        """创建条目卡片"""
        card = tk.Frame(self.item_list_frame, bg=self.colors["item_bg"],
                       relief='flat', bd=0,
                       highlightbackground=self.colors["border"],
                       highlightthickness=1,
                       cursor='hand2')
        card.pack(fill=tk.X, pady=2)

        # 获取显示信息
        title = item.get('name') or item.get('title') or f"条目 {index+1}"
        desc = item.get('description', '')
        if len(desc) > 25:
            desc = desc[:25] + "..."

        # 序号
        num_label = tk.Label(card, text=str(index+1),
                            bg=self.colors["accent"],
                            fg='white',
                            font=('Microsoft YaHei UI', 8, 'bold'),
                            width=3, height=1)
        num_label.pack(side=tk.LEFT, padx=(8, 5), pady=8)

        # 文本信息
        text_frame = tk.Frame(card, bg=self.colors["item_bg"])
        text_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, pady=8, padx=(0, 8))

        tk.Label(text_frame, text=title,
                 bg=self.colors["item_bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 10, 'bold'),
                 anchor='w').pack(fill=tk.X)
        tk.Label(text_frame, text=desc,
                 bg=self.colors["item_bg"],
                 fg=self.colors["text_light"],
                 font=('Microsoft YaHei UI', 8),
                 anchor='w').pack(fill=tk.X)

        # 绑定点击事件
        for widget in [card, num_label, text_frame] + text_frame.winfo_children():
            widget.bind('<Button-1>', lambda e, idx=index: self._select_item(idx))

        # 存储引用
        card._index = index

    def _select_item(self, index):
        """选择条目进行编辑"""
        if index < 0 or index >= len(self.current_data):
            return

        # 保存当前修改
        if self.is_modified and self.current_item_index >= 0:
            self._save_current_item(silent=True)

        self.current_item_index = index
        item = self.current_data[index]

        # 高亮选中的卡片
        for card in self.item_list_frame.winfo_children():
            if hasattr(card, '_index') and card._index == index:
                card.configure(highlightbackground=self.colors["accent"],
                              bg=self.colors["selected"])
                for child in card.winfo_children():
                    if isinstance(child, tk.Label) and child.cget('text') == str(index+1):
                        continue
                    child.configure(bg=self.colors["selected"])
                    for sub in child.winfo_children():
                        if isinstance(sub, tk.Label):
                            sub.configure(bg=self.colors["selected"])
            else:
                card.configure(highlightbackground=self.colors["border"],
                              bg=self.colors["item_bg"])
                for child in card.winfo_children():
                    if isinstance(child, tk.Label) and child.cget('text') in [str(i+1) for i in range(len(self.current_data))]:
                        continue
                    child.configure(bg=self.colors["item_bg"])
                    for sub in child.winfo_children():
                        if isinstance(sub, tk.Label):
                            sub.configure(bg=self.colors["item_bg"])

        # 显示保存按钮
        self.save_btn.pack(side=tk.RIGHT, padx=5)

        # 根据文件类型构建编辑界面
        self._build_edit_form(index, item)

    def _build_edit_form(self, index, item):
        """根据文件类型构建编辑表单"""
        # 清空编辑区
        for widget in self.edit_frame.winfo_children():
            widget.destroy()

        config = FILE_CONFIGS[self.current_file]

        # 标题
        title = item.get('name') or item.get('title') or f"条目 {index+1}"
        header = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        header.pack(fill=tk.X, pady=(0, 20))

        tk.Label(header, text=f"编辑: {title}",
                 bg=self.colors["item_bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 14, 'bold')).pack(side=tk.LEFT)

        tk.Label(header, text=f"#{index+1}",
                 bg=self.colors["accent"],
                 fg='white',
                 font=('Microsoft YaHei UI', 10, 'bold'),
                 padx=10, pady=2).pack(side=tk.LEFT, padx=10)

        # 分隔线
        tk.Frame(self.edit_frame, bg=self.colors["border"],
                height=1).pack(fill=tk.X, pady=(0, 20))

        # 根据类型构建表单
        if self.current_file == "quick-links-data.js":
            self._build_quicklink_form(item)
        elif self.current_file == "resources-data.js":
            self._build_resource_form(item)
        elif self.current_file == "software-data.js":
            self._build_software_form(item)

    def _create_form_field(self, parent, label, key, item, row, is_textarea=False):
        """创建表单字段"""
        field_frame = tk.Frame(parent, bg=self.colors["item_bg"])
        field_frame.pack(fill=tk.X, pady=8)

        tk.Label(field_frame, text=label,
                 bg=self.colors["item_bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 10, 'bold'),
                 anchor='w').pack(fill=tk.X, pady=(0, 5))

        if is_textarea:
            entry = tk.Text(field_frame, height=4,
                           font=('Consolas', 10),
                           relief='flat', bd=1,
                           highlightbackground=self.colors["border"],
                           highlightthickness=1,
                           wrap=tk.WORD)
            entry.insert('1.0', item.get(key, ''))
            entry.pack(fill=tk.X)
            entry.bind('<KeyRelease>', lambda e: self._on_field_change(key, entry.get('1.0', 'end-1c')))
        else:
            entry = tk.Entry(field_frame,
                            font=('Consolas', 10),
                            relief='flat', bd=1,
                            highlightbackground=self.colors["border"],
                            highlightthickness=1)
            entry.insert(0, item.get(key, ''))
            entry.pack(fill=tk.X)
            entry.bind('<KeyRelease>', lambda e: self._on_field_change(key, entry.get()))

        return entry

    def _on_field_change(self, key, value):
        """字段值改变时触发"""
        if self.current_item_index >= 0:
            self.current_data[self.current_item_index][key] = value
            self.is_modified = True

    def _build_quicklink_form(self, item):
        """构建常用链接编辑表单"""
        form = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        form.pack(fill=tk.X)

        # 基本信息区
        section = tk.LabelFrame(form, text="基本信息", bg=self.colors["item_bg"],
                               fg=self.colors["text"],
                               font=('Microsoft YaHei UI', 11, 'bold'),
                               padx=15, pady=10)
        section.pack(fill=tk.X, pady=(0, 15))

        self._create_form_field(section, "ID", "id", item, 0)
        self._create_form_field(section, "名称", "name", item, 1)
        self._create_form_field(section, "描述", "description", item, 2)
        self._create_form_field(section, "URL", "url", item, 3)

        # 图标配置区
        icon_section = tk.LabelFrame(form, text="图标配置", bg=self.colors["item_bg"],
                                    fg=self.colors["text"],
                                    font=('Microsoft YaHei UI', 11, 'bold'),
                                    padx=15, pady=10)
        icon_section.pack(fill=tk.X, pady=(0, 15))

        icon = item.get('icon', {})

        # 图标类型
        type_frame = tk.Frame(icon_section, bg=self.colors["item_bg"])
        type_frame.pack(fill=tk.X, pady=5)
        tk.Label(type_frame, text="类型",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(side=tk.LEFT)

        self.icon_type_var = tk.StringVar(value=icon.get('type', 'text'))
        type_combo = ttk.Combobox(type_frame, textvariable=self.icon_type_var,
                                  values=["text", "image"], state='readonly', width=15)
        type_combo.pack(side=tk.LEFT, padx=10)
        type_combo.bind('<<ComboboxSelected>>',
                        lambda e: self._on_icon_change('type', self.icon_type_var.get()))

        # 图标内容
        self._create_form_field(icon_section, "图标文本/路径", "content",
                               {**item, 'content': icon.get('content', '')}, 4)
        # 修正：需要更新icon对象
        content_entry = None
        for child in icon_section.winfo_children():
            if isinstance(child, tk.Frame):
                for sub in child.winfo_children():
                    if isinstance(sub, tk.Entry):
                        content_entry = sub
                        break

        if content_entry:
            content_entry.bind('<KeyRelease>',
                              lambda e: self._on_icon_change('content', content_entry.get()))

        # 渐变色预览和编辑
        gradient_frame = tk.Frame(icon_section, bg=self.colors["item_bg"])
        gradient_frame.pack(fill=tk.X, pady=10)

        tk.Label(gradient_frame, text="渐变色",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(anchor='w', pady=(0, 5))

        # 渐变色输入和预览
        grad_input_frame = tk.Frame(gradient_frame, bg=self.colors["item_bg"])
        grad_input_frame.pack(fill=tk.X)

        self.gradient_entry = tk.Entry(grad_input_frame,
                                      font=('Consolas', 10),
                                      relief='flat', bd=1,
                                      highlightbackground=self.colors["border"],
                                      highlightthickness=1)
        self.gradient_entry.insert(0, icon.get('gradient', ''))
        self.gradient_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.gradient_entry.bind('<KeyRelease>',
                                lambda e: self._update_gradient_preview())

        # 颜色选择按钮
        color_btn = tk.Button(grad_input_frame, text="🎨",
                             bg=self.colors["item_bg"],
                             font=('Segoe UI Emoji', 12),
                             relief='flat', bd=0,
                             cursor='hand2',
                             command=self._pick_gradient_color)
        color_btn.pack(side=tk.LEFT, padx=(5, 0))

        # 渐变预览
        self.gradient_preview = tk.Canvas(gradient_frame, height=40,
                                         highlightthickness=1,
                                         highlightbackground=self.colors["border"])
        self.gradient_preview.pack(fill=tk.X, pady=(10, 0))
        self._update_gradient_preview()

    def _on_icon_change(self, key, value):
        """图标字段改变"""
        if self.current_item_index >= 0:
            if 'icon' not in self.current_data[self.current_item_index]:
                self.current_data[self.current_item_index]['icon'] = {}
            self.current_data[self.current_item_index]['icon'][key] = value
            self.is_modified = True

    def _update_gradient_preview(self):
        """更新渐变色预览"""
        gradient_str = self.gradient_entry.get()
        self.current_data[self.current_item_index]['icon']['gradient'] = gradient_str
        self.is_modified = True

        self.gradient_preview.delete("all")

        # 解析渐变色
        colors = re.findall(r'#[0-9a-fA-F]{6}', gradient_str)
        if len(colors) >= 2:
            width = self.gradient_preview.winfo_width() or 300
            height = 40

            # 绘制渐变
            for x in range(width):
                ratio = x / width
                r1, g1, b1 = int(colors[0][1:3], 16), int(colors[0][3:5], 16), int(colors[0][5:7], 16)
                r2, g2, b2 = int(colors[1][1:3], 16), int(colors[1][3:5], 16), int(colors[1][5:7], 16)
                r = int(r1 + (r2 - r1) * ratio)
                g = int(g1 + (g2 - g1) * ratio)
                b = int(b1 + (b2 - b1) * ratio)
                color = f'#{r:02x}{g:02x}{b:02x}'
                self.gradient_preview.create_line(x, 0, x, height, fill=color)
        else:
            self.gradient_preview.create_text(150, 20, text="输入渐变色查看预览",
                                             fill=self.colors["text_light"])

    def _pick_gradient_color(self):
        """选择渐变色"""
        color = colorchooser.askcolor(title="选择颜色")[1]
        if color:
            current = self.gradient_entry.get()
            colors = re.findall(r'#[0-9a-fA-F]{6}', current)
            if len(colors) >= 2:
                new_gradient = f"linear-gradient(135deg, {color}, {colors[1]})"
            else:
                new_gradient = f"linear-gradient(135deg, {color}, #000000)"
            self.gradient_entry.delete(0, tk.END)
            self.gradient_entry.insert(0, new_gradient)
            self._update_gradient_preview()

    def _build_resource_form(self, item):
        """构建资源编辑表单"""
        form = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        form.pack(fill=tk.X)

        section = tk.LabelFrame(form, text="资源信息", bg=self.colors["item_bg"],
                               fg=self.colors["text"],
                               font=('Microsoft YaHei UI', 11, 'bold'),
                               padx=15, pady=10)
        section.pack(fill=tk.X, pady=(0, 15))

        self._create_form_field(section, "ID", "id", item, 0)
        self._create_form_field(section, "标题", "title", item, 1)
        self._create_form_field(section, "按钮文本", "name", item, 2)
        self._create_form_field(section, "描述", "description", item, 3)
        self._create_form_field(section, "URL", "url", item, 4)
        self._create_form_field(section, "图标 (路径或名称)", "icon", item, 5)

    def _build_software_form(self, item):
        """构建软件编辑表单"""
        form = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        form.pack(fill=tk.X)

        # 基本信息
        basic_section = tk.LabelFrame(form, text="基本信息", bg=self.colors["item_bg"],
                                     fg=self.colors["text"],
                                     font=('Microsoft YaHei UI', 11, 'bold'),
                                     padx=15, pady=10)
        basic_section.pack(fill=tk.X, pady=(0, 15))

        self._create_form_field(basic_section, "ID", "id", item, 0)
        self._create_form_field(basic_section, "标题", "title", item, 1)
        self._create_form_field(basic_section, "描述", "description", item, 2, is_textarea=True)

        # 版本和大小（并排）
        row_frame = tk.Frame(basic_section, bg=self.colors["item_bg"])
        row_frame.pack(fill=tk.X, pady=8)

        # 版本
        ver_frame = tk.Frame(row_frame, bg=self.colors["item_bg"])
        ver_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        tk.Label(ver_frame, text="版本",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(anchor='w', pady=(0, 5))
        ver_entry = tk.Entry(ver_frame, font=('Consolas', 10), relief='flat', bd=1,
                            highlightbackground=self.colors["border"], highlightthickness=1)
        ver_entry.insert(0, item.get('version', ''))
        ver_entry.pack(fill=tk.X)
        ver_entry.bind('<KeyRelease>', lambda e: self._on_field_change('version', ver_entry.get()))

        # 大小
        size_frame = tk.Frame(row_frame, bg=self.colors["item_bg"])
        size_frame.pack(side=tk.LEFT, fill=tk.X, expand=True)
        tk.Label(size_frame, text="大小",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(anchor='w', pady=(0, 5))
        size_entry = tk.Entry(size_frame, font=('Consolas', 10), relief='flat', bd=1,
                             highlightbackground=self.colors["border"], highlightthickness=1)
        size_entry.insert(0, item.get('size', ''))
        size_entry.pack(fill=tk.X)
        size_entry.bind('<KeyRelease>', lambda e: self._on_field_change('size', size_entry.get()))

        # 图标和分类（并排）
        row2_frame = tk.Frame(basic_section, bg=self.colors["item_bg"])
        row2_frame.pack(fill=tk.X, pady=8)

        # 图标
        icon_frame = tk.Frame(row2_frame, bg=self.colors["item_bg"])
        icon_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        tk.Label(icon_frame, text="图标路径",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(anchor='w', pady=(0, 5))
        icon_entry = tk.Entry(icon_frame, font=('Consolas', 10), relief='flat', bd=1,
                             highlightbackground=self.colors["border"], highlightthickness=1)
        icon_entry.insert(0, item.get('icon', ''))
        icon_entry.pack(fill=tk.X)
        icon_entry.bind('<KeyRelease>', lambda e: self._on_field_change('icon', icon_entry.get()))

        # 分类
        cat_frame = tk.Frame(row2_frame, bg=self.colors["item_bg"])
        cat_frame.pack(side=tk.LEFT, fill=tk.X, expand=True)
        tk.Label(cat_frame, text="分类",
                 bg=self.colors["item_bg"],
                 font=('Microsoft YaHei UI', 10, 'bold')).pack(anchor='w', pady=(0, 5))
        cat_entry = tk.Entry(cat_frame, font=('Consolas', 10), relief='flat', bd=1,
                            highlightbackground=self.colors["border"], highlightthickness=1)
        cat_entry.insert(0, item.get('category', ''))
        cat_entry.pack(fill=tk.X)
        cat_entry.bind('<KeyRelease>', lambda e: self._on_field_change('category', cat_entry.get()))

        # 下载链接区
        downloads_section = tk.LabelFrame(form, text="下载链接", bg=self.colors["item_bg"],
                                         fg=self.colors["text"],
                                         font=('Microsoft YaHei UI', 11, 'bold'),
                                         padx=15, pady=10)
        downloads_section.pack(fill=tk.X, pady=(0, 15))

        # 添加下载链接按钮
        add_dl_btn = tk.Button(downloads_section, text="➕ 添加下载链接",
                               bg=self.colors["accent"],
                               fg='white',
                               font=('Microsoft YaHei UI', 9),
                               relief='flat', bd=0,
                               padx=10, pady=4,
                               cursor='hand2',
                               command=self._add_download)
        add_dl_btn.pack(anchor='w', pady=(0, 10))

        # 下载链接列表
        self.downloads_container = tk.Frame(downloads_section, bg=self.colors["item_bg"])
        self.downloads_container.pack(fill=tk.X)

        downloads = item.get('downloads', [])
        for i, dl in enumerate(downloads):
            self._create_download_card(i, dl)

    def _create_download_card(self, index, download):
        """创建下载链接卡片"""
        card = tk.Frame(self.downloads_container, bg=self.colors["bg"],
                       relief='flat', bd=0,
                       highlightbackground=self.colors["border"],
                       highlightthickness=1)
        card.pack(fill=tk.X, pady=5)

        # 标题栏
        header = tk.Frame(card, bg=self.colors["bg"])
        header.pack(fill=tk.X, padx=10, pady=(8, 5))

        tk.Label(header, text=f"下载 #{index+1}",
                 bg=self.colors["bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 9, 'bold')).pack(side=tk.LEFT)

        del_btn = tk.Button(header, text="✕",
                           bg=self.colors["danger"],
                           fg='white',
                           font=('Arial', 8),
                           relief='flat', bd=0,
                           width=2, cursor='hand2',
                           command=lambda: self._remove_download(index))
        del_btn.pack(side=tk.RIGHT)

        # 字段
        fields_frame = tk.Frame(card, bg=self.colors["bg"], padx=10, pady=10)
        fields_frame.pack(fill=tk.X)

        # 名称
        tk.Label(fields_frame, text="名称", bg=self.colors["bg"],
                 font=('Microsoft YaHei UI', 8, 'bold')).pack(anchor='w')
        name_entry = tk.Entry(fields_frame, font=('Consolas', 9), relief='flat', bd=1,
                             highlightbackground=self.colors["border"], highlightthickness=1)
        name_entry.insert(0, download.get('name', ''))
        name_entry.pack(fill=tk.X, pady=(0, 5))
        name_entry.bind('<KeyRelease>',
                       lambda e, i=index: self._update_download(i, 'name', name_entry.get()))

        # URL
        tk.Label(fields_frame, text="URL", bg=self.colors["bg"],
                 font=('Microsoft YaHei UI', 8, 'bold')).pack(anchor='w')
        url_entry = tk.Entry(fields_frame, font=('Consolas', 9), relief='flat', bd=1,
                            highlightbackground=self.colors["border"], highlightthickness=1)
        url_entry.insert(0, download.get('url', ''))
        url_entry.pack(fill=tk.X, pady=(0, 5))
        url_entry.bind('<KeyRelease>',
                      lambda e, i=index: self._update_download(i, 'url', url_entry.get()))

        # 类型
        tk.Label(fields_frame, text="类型", bg=self.colors["bg"],
                 font=('Microsoft YaHei UI', 8, 'bold')).pack(anchor='w')
        type_entry = tk.Entry(fields_frame, font=('Consolas', 9), relief='flat', bd=1,
                             highlightbackground=self.colors["border"], highlightthickness=1)
        type_entry.insert(0, download.get('type', ''))
        type_entry.pack(fill=tk.X)
        type_entry.bind('<KeyRelease>',
                       lambda e, i=index: self._update_download(i, 'type', type_entry.get()))

    def _add_download(self):
        """添加下载链接"""
        if self.current_item_index >= 0:
            downloads = self.current_data[self.current_item_index].get('downloads', [])
            downloads.append({"name": "新下载链接", "url": "https://", "type": "exe"})
            self.current_data[self.current_item_index]['downloads'] = downloads
            self.is_modified = True
            # 重建整个编辑表单
            self._build_edit_form(self.current_item_index, self.current_data[self.current_item_index])

    def _remove_download(self, index):
        """移除下载链接"""
        if self.current_item_index >= 0:
            downloads = self.current_data[self.current_item_index].get('downloads', [])
            if 0 <= index < len(downloads):
                downloads.pop(index)
                self.current_data[self.current_item_index]['downloads'] = downloads
                self.is_modified = True
                # 重建整个编辑表单
                self._build_edit_form(self.current_item_index, self.current_data[self.current_item_index])

    def _update_download(self, index, key, value):
        """更新下载链接字段"""
        if self.current_item_index >= 0:
            downloads = self.current_data[self.current_item_index].get('downloads', [])
            if 0 <= index < len(downloads):
                downloads[index][key] = value
                self.is_modified = True

    def _show_empty_hint(self):
        """显示空数据提示"""
        for widget in self.edit_frame.winfo_children():
            widget.destroy()

        hint = tk.Frame(self.edit_frame, bg=self.colors["item_bg"])
        hint.pack(expand=True, fill=tk.BOTH)

        tk.Label(hint, text="📭",
                 bg=self.colors["item_bg"],
                 font=('Segoe UI Emoji', 48)).pack(pady=(100, 20))
        tk.Label(hint, text="暂无数据",
                 bg=self.colors["item_bg"],
                 fg=self.colors["text"],
                 font=('Microsoft YaHei UI', 16, 'bold')).pack()
        tk.Label(hint, text="点击上方「添加条目」按钮创建新数据",
                 bg=self.colors["item_bg"],
                 fg=self.colors["text_light"],
                 font=('Microsoft YaHei UI', 11)).pack(pady=(5, 0))

    def _add_item(self):
        """添加新条目"""
        if not self.current_file:
            return

        new_item = create_default_item(self.current_file)
        self.current_data.append(new_item)
        self.is_modified = True
        self._refresh_item_list()
        self._select_item(len(self.current_data) - 1)

    def _duplicate_item(self):
        """复制当前条目"""
        if self.current_item_index < 0:
            return

        item = copy.deepcopy(self.current_data[self.current_item_index])
        # 修改ID避免重复
        if 'id' in item:
            item['id'] = str(item['id']) + '_copy'
        self.current_data.append(item)
        self.is_modified = True
        self._refresh_item_list()
        self._select_item(len(self.current_data) - 1)

    def _delete_item(self):
        """删除当前条目"""
        if self.current_item_index < 0:
            return

        title = self.current_data[self.current_item_index].get('name') or \
                self.current_data[self.current_item_index].get('title') or \
                f"条目 {self.current_item_index + 1}"

        if messagebox.askyesno("确认删除", f"确定要删除「{title}」吗？"):
            self.current_data.pop(self.current_item_index)
            self.is_modified = True
            self.current_item_index = -1

            if self.current_data:
                self._refresh_item_list()
                self._select_item(0)
            else:
                self._refresh_item_list()
                self._show_empty_hint()

    def _save_current_item(self, silent=False):
        """保存当前条目的修改到内存"""
        # 这里不需要额外操作，因为修改已经实时更新到self.current_data
        if not silent:
            self.is_modified = False
            # 刷新列表显示（不重新构建编辑表单）
            self._refresh_item_list()
            messagebox.showinfo("保存成功", "条目已保存到内存")

    def _save_to_file(self):
        """保存所有修改到文件"""
        if not self.current_file:
            return

        config = FILE_CONFIGS[self.current_file]
        filepath = os.path.join(JS_DIR, self.current_file)

        try:
            save_js_file(filepath, config["var_name"],
                        self.current_data, config["type"])
            self.is_modified = False
            self.original_data = copy.deepcopy(self.current_data)
            messagebox.showinfo("保存成功", f"已保存到 {self.current_file}")
        except Exception as e:
            messagebox.showerror("保存失败", f"错误：{str(e)}")


def main():
    root = tk.Tk()
    app = DataEditorApp(root)

    # 添加保存到文件的菜单
    menubar = tk.Menu(root)
    file_menu = tk.Menu(menubar, tearoff=0)
    file_menu.add_command(label="保存到文件 (Ctrl+S)", command=app._save_to_file)
    file_menu.add_separator()
    file_menu.add_command(label="退出", command=root.quit)
    menubar.add_cascade(label="文件", menu=file_menu)
    root.config(menu=menubar)

    # 绑定快捷键
    root.bind('<Control-s>', lambda e: app._save_to_file())

    # 关闭前检查
    def on_closing():
        if app.is_modified:
            if messagebox.askyesno("未保存", "有未保存的修改，是否保存到文件？"):
                app._save_to_file()
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()


if __name__ == "__main__":
    main()
