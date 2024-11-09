import React from "react";
import { Typography, Link } from "@mui/material";

function AppFooter() {
    return (
        <div className="AppFooter" style={{ padding: '10px', background: '#f0f0f0', textAlign: 'center', position: 'relative' }}>
            <Typography variant="body2">
                <Link href="tel:123456789" underline="hover" color="inherit">
                    +123456789
                </Link>{" "}
                |{" "}
                <Link href="https://www.google.com" target="_blank" underline="hover" color="inherit">
                    Privacy Policy
                </Link>{" "}
                |{" "}
                <Link href="https://www.google.com" target="_blank" underline="hover" color="inherit">
                    Terms of Use
                </Link>
            </Typography>
        </div>
    );
}

export default AppFooter;