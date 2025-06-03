import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { ErrorWithStatusCode } from "../utils/index.js";

export const getAccessToken = async (req, res) => {
  try {
    // Ambil refresh token dari cookie, simpan ke dalam variabel "refreshToken"
    const refreshToken = req.cookies.refreshToken;

    // Kalau refresh token gaada, kasih error (401)
    if (!refreshToken)
      throw new ErrorWithStatusCode("Refresh token tidak ada", 401);

    // Cari user yg punya refresh token yg sama di db
    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    // Kalo user gapunya refresh token, masuk ke catch,
    // kasih message "Refresh token tidak ada" (401)
    if (!user.refresh_token)
      throw new ErrorWithStatusCode("Refresh token tidak ada", 401);
    // Kalo ketemu, verifikasi refresh token
    else {
      jwt.verify(
        refreshToken, // <- refresh token yg mau diverifikasi
        process.env.REFRESH_TOKEN_SECRET, // <- Secret key dari refresh token
        (error, decoded) => {
          // Jika ada error (access token tidak valid/kadaluarsa), lempar ke catch dan kirim respons error
          if (error)
            throw new ErrorWithStatusCode("Refresh token tidak valid", 403);

          // Konversi data user ke bentuk object
          const userPlain = user.toJSON();

          // Hapus data sensitif sebelum membuat token baru, dalam hal ini password sama refresh token dihapus
          const { password: _, refresh_token: __, ...safeUserData } = userPlain;

          // Buat access token baru (expire selama 30 detik)
          const accessToken = jwt.sign(
            safeUserData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

          // Kirim respons sukses + kasih access token yg udah dibikin tadi
          return res.status(200).json({
            status: "Success",
            message: "Berhasil mendapatkan access token.",
            accessToken, // <- Access token baru untuk client
          });
        }
      );
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};
