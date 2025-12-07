import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    // Check Authorization header first (for localStorage tokens)
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
        // Fall back to cookie (for backward compatibility)
        token = req.cookies.token;
    }

    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenDecode.id; // Attach user ID to request
        req.user = tokenDecode; // Keep for backward compatibility
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;