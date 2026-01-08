// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 模拟加载进度
    simulateLoadingProgress();

    // 初始化菜单交互
    initMenu();

    // 初始化运行天数计算
    initRunningDays();

    // 初始化手机端菜单切换
    initMobileMenu();
});

// 模拟加载进度
function simulateLoadingProgress() {
    const loader = document.getElementById('loader');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');

    // 检查是否存在必要的元素
    if (!progressFill || !progressPercent) {
        return; // 如果元素不存在，直接返回，避免错误
    }

    let progress = 0;
    const interval = setInterval(function () {
        progress += Math.random() * 15; // 随机增加进度
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            // 进度完成后隐藏加载动画
            setTimeout(function () {
                if (loader) {
                    loader.classList.add('hidden');
                }
            }, 500);
        }

        // 更新进度条和百分比
        progressFill.style.width = progress + '%';
        progressPercent.textContent = Math.round(progress) + '%';
    }, 300); // 每300毫秒更新一次
}

// 菜单交互功能 - 简化为只处理一级菜单
function initMenu() {
    const menuItems = document.querySelectorAll('.menu-item');

    // 点击菜单项时高亮当前项
    menuItems.forEach(item => {
        const menuLink = item.querySelector('.menu-title');

        menuLink.addEventListener('click', function () {
            // 移除所有菜单项的active状态
            menuItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // 给当前点击的菜单项添加active状态
            item.classList.add('active');
        });
    });
}

// 运行天数计算功能
function initRunningDays() {
    // 网站开始运行时间（2025年12月24日）
    const startTime = new Date('2025-12-24T00:00:00').getTime();
    const runningDaysElement = document.getElementById('running-days');

    // 更新运行时间
    function updateRunningTime() {
        const now = new Date().getTime();
        const diff = now - startTime;

        // 计算天、时、分、秒
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // 格式化显示
        runningDaysElement.textContent = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    }

    // 初始更新
    updateRunningTime();

    // 每秒更新一次
    setInterval(updateRunningTime, 1000);
}



// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // 只处理页面内锚点
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();

            const offsetTop = target.offsetTop - 100; // 减去顶部偏移量
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 监听滚动事件，高亮当前可见模块对应的菜单项
window.addEventListener('scroll', function () {
    const modules = document.querySelectorAll('.module');
    const menuLinks = document.querySelectorAll('.menu-title');

    let currentModuleId = '';

    // 找到当前可见的模块
    modules.forEach(module => {
        const moduleTop = module.offsetTop - 150;
        const moduleBottom = moduleTop + module.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= moduleTop && scrollPosition < moduleBottom) {
            currentModuleId = '#' + module.id;
        }
    });

    // 更新对应的菜单项高亮
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const menuItem = link.closest('.menu-item');

        if (linkHref === currentModuleId) {
            menuItem.classList.add('active');
        } else {
            menuItem.classList.remove('active');
        }
    });
});

// 初始化时高亮第一个菜单项
function initHighlight() {
    const firstMenuItem = document.querySelector('.menu-item');
    if (firstMenuItem) {
        firstMenuItem.classList.add('active');
    }
}

// 添加初始化高亮
window.addEventListener('load', initHighlight);

// 初始化搜索引擎功能
function initSearchEngine() {
    const engineBtns = document.querySelectorAll('.engine-btn');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');

    // 搜索引擎映射和描述
    const engines = {
        '站内搜索': {
            url: 'https://example.com/search?q=',
            desc: '搜索本站导航内容'
        },
        '百度': {
            url: 'https://www.baidu.com/s?wd=',
            desc: '全球最大中文搜索引擎'
        },
        '必应': {
            url: 'https://www.bing.com/search?q=',
            desc: '微软旗下搜索引擎'
        },
        '谷歌': {
            url: 'https://www.google.com/search?q=',
            desc: '全球最大搜索引擎'
        },
        'CSDN': {
            url: 'https://so.csdn.net/so/search?q=',
            desc: '国内最大开发者社区'
        },
        '博客园': {
            url: 'https://zzkx.cnblogs.com/s?w=',
            desc: '开发者博客平台'
        },
        'Yandex': {
            url: 'https://yandex.com/search/?text=',
            desc: '俄罗斯搜索引擎'
        },
        'Freebuf': {
            url: 'https://www.freebuf.com/search?search=',
            desc: '网络安全资讯平台'
        },
        'BiliBili': {
            url: 'https://search.bilibili.com/all?keyword=',
            desc: '哔哩哔哩弹幕视频网站'
        },
        '秘塔AI': {
            url: 'https://metaso.cn/?q=',
            desc: 'AI搜索引擎'
        },
        'ZoomEy': {
            url: 'https://www.zoomeye.org/searchResult?q=',
            desc: '网络空间搜索引擎'
        },
        '茶杯狐': {
            url: 'https://www.cupfox.ai/search/-------------.html?wd=',
            desc: '影视资源搜索'
        },
        'DuckDuckGo': {
            url: 'https://duckduckgo.com/?q=',
            desc: '注重隐私保护的搜索引擎'

        }
    };

    let currentEngine = '必应';

    // 初始化搜索框占位符
    function updateSearchPlaceholder() {
        searchInput.placeholder = engines[currentEngine].desc;
    }

    // 初始设置占位符
    updateSearchPlaceholder();

    // 切换搜索引擎
    engineBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 移除所有按钮的active状态
            engineBtns.forEach(otherBtn => {
                otherBtn.classList.remove('active');
            });

            // 给当前点击的按钮添加active状态
            this.classList.add('active');

            // 更新当前搜索引擎
            currentEngine = this.getAttribute('data-engine');

            // 更新搜索框占位符
            updateSearchPlaceholder();
        });
    });

    // 执行搜索
    function performSearch() {
        const originalQuery = searchInput.value;
        // 安全验证：获取安全的查询内容
        const safeQuery = isValidSearchQuery(originalQuery);

        // 如果返回false，说明查询内容不安全或为空
        if (!safeQuery) {
            return;
        }

        // 更新输入框内容为安全内容
        searchInput.value = safeQuery;

        if (safeQuery.trim()) {
            if (currentEngine === '站内搜索') {
                // 站内搜索：搜索导航区标题关键字并匹配跳转
                const modules = document.querySelectorAll('.module');
                const matchedModules = [];
                const matchedCards = [];

                // 转换查询为小写，用于模糊匹配
                const lowerQuery = safeQuery.toLowerCase();

                // 遍历所有模块，收集匹配的模块和卡片
                modules.forEach(module => {
                    // 检查模块标题是否匹配
                    const moduleTitle = module.querySelector('.module-header h2').textContent;
                    const isModuleMatch = moduleTitle.toLowerCase().includes(lowerQuery);

                    if (isModuleMatch) {
                        matchedModules.push(module);
                    }

                    // 检查模块内的导航卡片是否匹配
                    const navCards = module.querySelectorAll('.nav-card');
                    navCards.forEach(card => {
                        const cardTitle = card.querySelector('.card-title').textContent;
                        if (cardTitle.toLowerCase().includes(lowerQuery)) {
                            matchedCards.push(card);
                            // 如果卡片匹配，也将模块加入匹配列表
                            if (!matchedModules.includes(module)) {
                                matchedModules.push(module);
                            }
                        }
                    });
                });

                if (matchedModules.length > 0) {
                    // 找到匹配的模块，滚动到第一个匹配模块
                    const firstMatchedModule = matchedModules[0];
                    // 滚动到模块位置，减去顶部偏移量
                    const offsetTop = firstMatchedModule.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // 高亮显示所有匹配的卡片
                    matchedCards.forEach(card => {
                        card.style.boxShadow = '0 0 10px rgba(100, 181, 246, 0.5)';
                        setTimeout(() => {
                            card.style.boxShadow = '';
                        }, 3000);
                    });
                }
            } else {
                // 原有搜索逻辑，为FreeBuf引擎添加特殊处理
                let url;
                if (currentEngine === 'Freebuf') {
                    // FreeBuf需要特殊的URL格式
                    url = `https://www.freebuf.com/search?search=${encodeURIComponent(safeQuery)}&activeType=1&society_id=0&society_name=`;
                } else {
                    url = engines[currentEngine].url + encodeURIComponent(safeQuery);
                }
                window.open(url, '_blank');
            }
        }
    }

    // 搜索内容安全验证 - 全局应用
    function isValidSearchQuery(query) {
        // 防止XSS攻击，移除危险标签和属性
        let safeQuery = query;

        // 移除script标签
        safeQuery = safeQuery.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');

        // 移除事件属性
        safeQuery = safeQuery.replace(/on\w+\s*=\s*"[^"]*"|on\w+\s*=\s*'[^']*'|on\w+\s*=\s*[^\s]+/gmi, '');

        // 移除iframe标签
        safeQuery = safeQuery.replace(/<iframe[^>]*>([\S\s]*?)<\/iframe>/gmi, '');

        // 移除object标签
        safeQuery = safeQuery.replace(/<object[^>]*>([\S\s]*?)<\/object>/gmi, '');

        // 移除embed标签
        safeQuery = safeQuery.replace(/<embed[^>]*>([\S\s]*?)<\/embed>/gmi, '');

        // 移除form标签
        safeQuery = safeQuery.replace(/<form[^>]*>([\S\s]*?)<\/form>/gmi, '');

        // 移除危险协议
        safeQuery = safeQuery.replace(/javascript:/gmi, '');
        safeQuery = safeQuery.replace(/data:/gmi, '');
        safeQuery = safeQuery.replace(/vbscript:/gmi, '');
        safeQuery = safeQuery.replace(/livescript:/gmi, '');

        // 移除样式注入
        safeQuery = safeQuery.replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');
        safeQuery = safeQuery.replace(/style\s*=\s*"[^"]*"/gmi, '');
        safeQuery = safeQuery.replace(/style\s*=\s*'[^']*'/gmi, '');

        // 检查是否为空或只包含空格
        if (!safeQuery.trim()) {
            return false;
        }

        return safeQuery;
    }

    // 实时调整搜索框宽度
    function setupDynamicWidthAdjustment() {
        const searchBox = document.querySelector('.search-box');

        // 创建一个隐藏的span元素来测量文本宽度
        const textMeasurer = document.createElement('span');
        textMeasurer.style.position = 'absolute';
        textMeasurer.style.left = '-9999px';
        textMeasurer.style.top = '-9999px';
        textMeasurer.style.visibility = 'hidden';
        textMeasurer.style.whiteSpace = 'nowrap';
        textMeasurer.style.font = getComputedStyle(searchInput).font;
        textMeasurer.style.padding = '10px 14px';
        document.body.appendChild(textMeasurer);

        // 调整搜索框宽度的函数
        function adjustSearchBoxWidth(forceMin = false) {
            const inputValue = searchInput.value;
            const placeholder = searchInput.placeholder;

            let referenceText;
            if (forceMin || !inputValue.trim()) {
                // 如果强制使用最小宽度或输入为空，使用固定的短文本作为参考
                referenceText = '搜索';
            } else {
                // 否则使用输入内容或占位符作为参考
                referenceText = inputValue || placeholder;
            }
            textMeasurer.textContent = referenceText;

            // 计算合适的宽度，加上搜索图标的宽度和一些额外空间
            const iconWidth = 50; // 搜索图标的大致宽度
            const extraSpace = 20; // 额外空间
            const calculatedWidth = textMeasurer.offsetWidth + iconWidth + extraSpace;

            // 设置搜索框宽度，确保在最小和最大宽度范围内
            searchBox.style.width = `${Math.max(350, Math.min(800, calculatedWidth))}px`;
        }

        // 初始化宽度（使用最小宽度）
        adjustSearchBoxWidth(true);

        // 输入时调整宽度（使用内容宽度）
        searchInput.addEventListener('input', () => adjustSearchBoxWidth(false));

        // 聚焦时使用内容宽度
        searchInput.addEventListener('focus', () => adjustSearchBoxWidth(false));

        // 失焦时恢复到最小宽度
        searchInput.addEventListener('blur', () => adjustSearchBoxWidth(true));

        // 窗口大小变化时重新调整
        window.addEventListener('resize', adjustSearchBoxWidth);
    }

    // 实时安全验证输入内容
    function setupRealTimeSecurityValidation() {
        // 为搜索输入框添加实时安全验证
        searchInput.addEventListener('input', function () {
            const currentValue = this.value;
            const safeValue = isValidSearchQuery(currentValue);

            // 如果返回的是安全值（字符串），则更新输入框
            if (typeof safeValue === 'string') {
                this.value = safeValue;
            }
        });

        // 为搜索输入框添加粘贴事件监听
        searchInput.addEventListener('paste', function (e) {
            e.preventDefault();
            const clipboardData = e.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text');
            const safeText = isValidSearchQuery(pastedText);

            // 如果返回的是安全值（字符串），则粘贴到输入框
            if (typeof safeText === 'string') {
                this.value = safeText;
            }
        });

        // 为所有a标签添加安全检查
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && (href.startsWith('javascript:') || href.startsWith('data:') || href.startsWith('vbscript:'))) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }

    // 点击搜索图标执行搜索
    searchIcon.addEventListener('click', performSearch);

    // 按下回车键执行搜索
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 启用实时安全验证
    setupRealTimeSecurityValidation();


}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', function () {
    initSearchEngine();
    initRealTime();
    initBackToTop();
    initAvatarClick();
    initDynamicLogos();
});

// 初始化实时时间显示
function initRealTime() {
    const timeElement = document.getElementById('search-time');

    // 更新时间函数
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';

        // 转换为12小时制
        hours = hours % 12;
        hours = hours ? hours : 12; // 0点转换为12
        hours = hours.toString().padStart(2, '0');

        timeElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
    }

    // 初始更新
    updateTime();

    // 每秒更新一次
    setInterval(updateTime, 1000);
}

// 初始化置顶按钮功能
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    // 滚动事件：显示/隐藏按钮
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // 点击事件：返回顶部
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 添加Unicode箭头符号
    backToTopBtn.innerHTML = '↑';
}

// 初始化头像点击刷新功能
function initAvatarClick() {
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('click', function () {
            location.reload();
        });
    }
}

// 初始化动态Logo加载功能
function initDynamicLogos() {
    const navCards = document.querySelectorAll('.nav-card');
    const defaultLogoUrl = 'https://files.codelife.cc/icons/dino.svg';
    const timeoutDelay = 3000; // 3秒超时

    navCards.forEach(card => {
        const link = card;
        const img = card.querySelector('.card-icon img');
        const href = link.getAttribute('href');

        // 检查是否需要手动覆盖logo
        // 如果src不是默认值，或者有data-manual="true"属性，则跳过动态加载
        if (img.src !== defaultLogoUrl || img.getAttribute('data-manual') === 'true') {
            return;
        }

        // 设置data-default属性
        if (!img.getAttribute('data-default')) {
            img.setAttribute('data-default', defaultLogoUrl);
        }

        // 创建新的图片元素来测试加载
        const testImg = new Image();
        // 使用用户指定的固定接口，目标网址直接使用完整URL
        const logoUrl = `https://icon.bqb.cool?url=${encodeURIComponent(href)}`;

        // 超时处理
        const timeout = setTimeout(() => {
            // 超时，使用默认logo
            img.src = defaultLogoUrl;
        }, timeoutDelay);

        // 加载成功处理
        testImg.onload = function () {
            clearTimeout(timeout);
            img.src = logoUrl;
        };

        // 加载失败处理
        testImg.onerror = function () {
            clearTimeout(timeout);
            img.src = defaultLogoUrl;
        };

        // 开始加载测试图片
        testImg.src = logoUrl;
    });
}

// 初始化手机端菜单切换功能
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const menuLinks = document.querySelectorAll('.menu-title');

    // 点击汉堡菜单按钮切换侧边栏显示/隐藏
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // 点击内容区域关闭侧边栏
    content.addEventListener('click', function () {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // 点击菜单链接后关闭侧边栏
    menuLinks.forEach(item => {
        item.addEventListener('click', function () {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });

    // 监听窗口大小变化，在桌面端自动展开侧边栏
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
}
