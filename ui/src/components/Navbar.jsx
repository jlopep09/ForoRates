import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { NavLink } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './SessionButtons/LoginButton';
import LogoutButton from './SessionButtons/LogoutButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Delete from '@mui/icons-material/Delete';
import DoneAll from '@mui/icons-material/DoneAll';
import { ENDPOINTS } from '../../constants';

// Logo components
function Logo() {
  return (
    <>
      <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <NavLink to="/">ForoRates</NavLink>
      </Typography>
    </>
  );
}

function MobileLogo() {
  return (
    <>
      <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
      <Typography
        variant="h5"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: 'flex', md: 'none' },
          flexGrow: 1,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        ForoRates
      </Typography>
    </>
  );
}

const pages = [
  { name: 'HOME', path: '/' },
  { name: 'RANKING', path: '/ranking' },
  { name: 'SHOP', path: '/shop' },
];

function NavButtons({ onClick }) {
  return (
    <>
      {pages.map(page => (
        <Button
          key={page.name}
          onClick={onClick}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          <NavLink to={page.path}>{page.name}</NavLink>
        </Button>
      ))}
    </>
  );
}

// Menus
function MobileMenu({ anchorEl, open, handleOpen, handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton size="large" onClick={handleOpen} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {pages.map(page => (
          <MenuItem key={page.name} onClick={handleClose}>
            <Typography textAlign="center">
              <NavLink to={page.path}>{page.name}</NavLink>
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

function DesktopMenu({ handleClose }) {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <NavButtons onClick={handleClose} />
    </Box>
  );
}

function NotificationMenu({
  anchorEl, open, handleOpen, handleClose, notifications, markAllAsRead, deleteAllNotifications
}) {
  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton onClick={handleOpen} color="inherit">
          <NotificationsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 370, maxHeight: 400, p: 1 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #ccc' }}>
          <Typography variant="subtitle1" fontWeight={600}>Notificaciones</Typography>
          <Box>
            <Tooltip title="Marcar todas como leídas">
              <IconButton size="small" onClick={markAllAsRead}><DoneAll fontSize="small" /></IconButton>
            </Tooltip>
            <Tooltip title="Borrar todas">
              <IconButton size="small" onClick={deleteAllNotifications}><Delete fontSize="small" /></IconButton>
            </Tooltip>
          </Box>
        </Box>
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" textAlign="center" width="100%">No hay notificaciones</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif, idx) => (
            <MenuItem
              key={idx}
              onClick={() => { handleClose(); if (notif.id_thread) window.location.href = `/thread/${notif.id_thread}`; }}
              sx={{
                backgroundColor: notif.read ? 'transparent' : 'rgba(161,161,161,0.36)',
                borderRadius: 1, mb: 0.5, px: 2, py: 1,
                '&:hover': { backgroundColor: notif.read ? 'rgba(0,0,0,0.04)' : 'rgba(25,118,210,0.15)' }
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={notif.read ? 400 : 700}>{notif.title}</Typography>
                <Typography variant="body2" color="text.secondary">{notif.content}</Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

function UserMenu({ anchorEl, open, handleOpen, handleClose, dbUser }) {
  return (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar alt="User" src={dbUser.img_link? dbUser.img_link : "/static/images/avatar/2.jpg"} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}><NavLink to="/profile"><Button>Profile</Button></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink to="/settings"><Button>Settings</Button></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><LogoutButton /></MenuItem>
      </Menu>
    </>
  );
}

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [dbUser, setDbUser] = React.useState();
  const { user } = useAuth0();

  // Fetch or create user
  React.useEffect(() => {
    const checkOrCreateUser = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${ENDPOINTS.USERS}?email=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length) return setDbUser(data[0]);
        }
        const newUser = { fullname: user.name, username: user.nickname, email: user.email, img_link: user.picture, is_admin: false, reputation: 0, score: 0, password: 'google' };
        await fetch(`${ENDPOINTS.USERS}/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
      } catch (e) { console.error(e); }
    };
    checkOrCreateUser();
  }, [user]);

  // Fetch notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!dbUser?.id) return;
      try {
        const res = await fetch(`${ENDPOINTS.NOTIFICATIONS}/${dbUser.id}`);
        if (!res.ok) throw new Error();
        setNotifications(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchNotifications();
  }, [dbUser]);

  // Handlers
  const handleOpenNav = e => setAnchorElNav(e.currentTarget);
  const handleCloseNav = () => setAnchorElNav(null);
  const handleOpenUser = e => setAnchorElUser(e.currentTarget);
  const handleCloseUser = () => setAnchorElUser(null);
  const handleOpenNotif = e => setAnchorElNotif(e.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const markAllAsRead = async () => {
    if (!dbUser?.id) return;
    try {
      const res = await fetch(`${ENDPOINTS.NOTIFICATIONS}/mark_all_read/${dbUser.id}`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
  };

  const deleteAllNotifications = async () => {
    if (!dbUser?.id) return;
    try {
      const res = await fetch(`${ENDPOINTS.NOTIFICATIONS}/delete_all/${dbUser.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setNotifications([]);
    } catch (e) { console.error(e); }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />
          <MobileMenu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            handleOpen={handleOpenNav}
            handleClose={handleCloseNav}
          />
          <MobileLogo />
          <DesktopMenu handleClose={handleCloseNav} />
          {!user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}><LoginButton /></Box>
          ) : (
            <>
              <NotificationMenu
                anchorEl={anchorElNotif}
                open={Boolean(anchorElNotif)}
                handleOpen={handleOpenNotif}
                handleClose={handleCloseNotif}
                notifications={notifications}
                markAllAsRead={markAllAsRead}
                deleteAllNotifications={deleteAllNotifications}
              />
              {dbUser && (
                <UserMenu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  handleOpen={handleOpenUser}
                  handleClose={handleCloseUser}
                  dbUser={dbUser}
                />
              )}

            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
