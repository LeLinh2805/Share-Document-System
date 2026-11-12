const authService = require('../services/authService');
const guiMail = require('../utils/sendMail');

const dangKy = async (req, res) => {
    try {
        const { hoTen, email, matKhau } = req.body;

        if (!hoTen || !email || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin!'
            });
        }

        // Gọi service
        const { taiKhoan, rawToken } = await authService.dangKy({ hoTen, email, matKhau });

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

        // Gửi mail xác thực
        await guiMail(
            email,
            'Xác thực tài khoản - Hệ thống chia sẻ tài liệu',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #1f2937;">Chào ${hoTen}!</h2>
                <p style="color: #4b5563;">Cảm ơn bạn đã đăng ký. Vui lòng xác thực email để kích hoạt tài khoản:</p>
                <a href="${verifyUrl}" 
                   style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Xác thực ngay
                </a>
                <p style="color: #6b7280; margin-top: 16px;">Link có hiệu lực trong <strong>24 giờ</strong>.</p>
            </div>
            `
        );

        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
        });

    } catch (error) {
        console.error("Loi dang ky:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const xacThucEmail = async (req, res) => {
    try {
        const { token } = req.params;

        await authService.xacThucEmail({ token });

        return res.status(200).json({
            success: true,
            message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay.'
        });

    } catch (error) {
        console.error("Loi xac thuc email:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const guiLaiEmailXacThuc = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp địa chỉ email!'
            });
        }

        const { taiKhoan, rawToken } = await authService.guiLaiEmailXacThuc({ email: email.trim().toLowerCase() });

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

        // Gửi mail xác thực
        await guiMail(
            taiKhoan.email,
            'Gửi lại link xác thực tài khoản - Hệ thống chia sẻ tài liệu',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #1e293b; margin-top: 0;">Chào ${taiKhoan.hoTen}!</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    Bạn đã gửi yêu cầu cấp lại link kích hoạt tài khoản tại <strong>Hệ thống chia sẻ tài liệu học tập</strong>. Vui lòng bấm vào nút bên dưới để hoàn tất xác thực:
                </p>
                <div style="margin: 28px 0; text-align: center;">
                    <a href="${verifyUrl}" 
                       style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                        Kích hoạt tài khoản ngay
                    </a>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                    Link kích hoạt này có hiệu lực trong vòng <strong>24 giờ</strong>. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này.
                </p>
            </div>
            `
        );

        return res.status(200).json({
            success: true,
            message: 'Đã gửi lại link xác thực vào email của bạn! Vui lòng kiểm tra hộp thư đến (và mục Spam nếu có).'
        });
    } catch (error) {
        console.error("Loi gui lai email xac thuc:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const dangNhap = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        if (!email || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email và mật khẩu!'
            });
        }

        const result = await authService.dangNhap({ email, matKhau });

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: result  
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const quenMatKhau = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email!'
            });
        }

        const result = await authService.quenMatKhau({ email });
        if (result) {
            const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${result.rawToken}`;

            await guiMail(
                email,
                'Đặt lại mật khẩu - Hệ thống chia sẻ tài liệu',
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #dc2626;">Đặt lại mật khẩu</h2>
                    <p style="color: #4b5563;">Chào ${result.hoTen}, click vào nút bên dưới để đặt lại mật khẩu:</p>
                    <a href="${resetUrl}"
                       style="display: inline-block; background-color: #dc2626; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                        Đặt lại mật khẩu
                    </a>
                    <p style="color: #6b7280; margin-top: 16px;">Link có hiệu lực trong <strong>15 phút</strong>.</p>
                </div>
                `
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi!'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const datLaiMatKhau = async (req, res) => {
    try {
        const { token, matKhauMoi } = req.body;

        if (!token || !matKhauMoi) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu token hoặc mật khẩu mới!'
            });
        }

        await authService.datLaiMatKhau({ token, matKhauMoi });

        return res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công!'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { dangKy, xacThucEmail, guiLaiEmailXacThuc, dangNhap, quenMatKhau, datLaiMatKhau };