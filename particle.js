// 背景粒子鼠标跟随汇聚效果
(function () {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }

    function initParticles() {
        // 创建画布元素
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        const ctx = canvas.getContext('2d');

        // 设置画布样式
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1'; // 置于背景层

        // 将画布添加到页面
        document.body.appendChild(canvas);

        // 设置画布尺寸
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 粒子类
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.originalSpeedX = this.speedX;
                this.originalSpeedY = this.speedY;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.color = `rgba(100, 181, 246, ${this.opacity})`;
                this.attraction = 0.05;
            }

            update(mouseX, mouseY, clickX, clickY, isClicking) {
                let targetX, targetY;

                // 如果点击状态，粒子向点击位置汇聚
                if (isClicking) {
                    targetX = clickX;
                    targetY = clickY;
                } else {
                    // 否则向当前鼠标位置汇聚
                    targetX = mouseX;
                    targetY = mouseY;
                }

                // 计算粒子到目标位置的距离
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 如果距离小于250px，粒子向目标位置汇聚
                if (distance < 250) {
                    const angle = Math.atan2(dy, dx);
                    this.speedX += Math.cos(angle) * this.attraction;
                    this.speedY += Math.sin(angle) * this.attraction;

                    // 限制粒子速度
                    const maxSpeed = 8;
                    const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
                    if (speed > maxSpeed) {
                        this.speedX = (this.speedX / speed) * maxSpeed;
                        this.speedY = (this.speedY / speed) * maxSpeed;
                    }
                } else {
                    // 如果距离大于250px，粒子恢复原速度
                    this.speedX += (this.originalSpeedX - this.speedX) * 0.1;
                    this.speedY += (this.originalSpeedY - this.speedY) * 0.1;
                }

                // 更新粒子位置
                this.x += this.speedX;
                this.y += this.speedY;

                // 边界检测，粒子超出画布后重置
                if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // 粒子数组
        const particles = [];

        // 根据屏幕宽度设置粒子数量
        const getParticleCount = () => {
            if (window.innerWidth <= 768) {
                return 100; // 手机端100个粒子
            } else if (window.innerWidth <= 1200) {
                return 200; // 平板端200个粒子
            } else {
                return 300; // 桌面端300个粒子
            }
        };

        let particleCount = getParticleCount();

        // 创建初始粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // 监听窗口大小变化，调整粒子数量
        window.addEventListener('resize', () => {
            const newCount = getParticleCount();
            if (newCount < particles.length) {
                // 如果新数量小于当前数量，减少粒子
                particles.splice(newCount);
            } else if (newCount > particles.length) {
                // 如果新数量大于当前数量，增加粒子
                for (let i = particles.length; i < newCount; i++) {
                    particles.push(new Particle());
                }
            }
            particleCount = newCount;
        });

        // 鼠标位置
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;

        // 鼠标点击位置（用于生成新粒子）
        let clickX = mouseX;
        let clickY = mouseY;
        let isClicking = false;

        // 鼠标移动事件监听
        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 鼠标点击事件监听 - 生成新粒子并汇聚
        window.addEventListener('click', function (e) {
            clickX = e.clientX;
            clickY = e.clientY;
            isClicking = true;

            // 根据屏幕宽度设置点击生成的粒子数量
            const clickParticleCount = window.innerWidth <= 768 ? 10 : 30;

            // 生成新粒子
            for (let i = 0; i < clickParticleCount; i++) {
                const newParticle = new Particle();
                // 设置新粒子的初始位置在点击位置周围
                newParticle.x = clickX + (Math.random() - 0.5) * 100;
                newParticle.y = clickY + (Math.random() - 0.5) * 100;
                particles.push(newParticle);
            }

            // 3秒后停止点击状态
            setTimeout(function () {
                isClicking = false;
            }, 3000);
        });

        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 遍历所有粒子，不限制数量
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouseX, mouseY, clickX, clickY, isClicking);
                particles[i].draw();
            }

            requestAnimationFrame(animate);
        }

        // 开始动画
        animate();
    }
})();