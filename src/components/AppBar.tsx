import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

interface MenuAppBarProps {
    userId: number | null;
}

const MenuAppBar: React.FC<MenuAppBarProps> = ({ userId }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (userId) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {userId && (
                            <>
                                <Typography variant="h6" component="div" sx={{ margin: '10px' }} 
                                            onClick={() => navigate(`/dashboard/${userId}`)}>
                                    Dashboard
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ margin: '10px' }} 
                                            onClick={() => navigate(`/transactions/${userId}`)}>
                                    History
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ margin: '10px' }} 
                                            onClick={() => navigate(`/compare/${userId}`)}>
                                    Compare
                                </Typography>
                            </>
                        )}
                    </Box>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                        <AccountCircle sx={{ height: '35px', width: '35px'}} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuAppBar;
