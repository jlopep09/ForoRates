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
import { Logout } from '@mui/icons-material';
import LogoutButton from './SessionButtons/LogoutButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Delete from '@mui/icons-material/Delete';
import DoneAll from '@mui/icons-material/DoneAll';
import { ENDPOINTS } from '../../constants';

const pages = ['Home', 'Ranking', 'Store'];
const settings = ['Profile', 'Settings', 'Logout'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]); // Simulación
  const [dbUser, setDbUser] = React.useState();


  // Simulación de datos de usuario (puedes reemplazar con datos reales o contexto)
  const {user} = useAuth0(); // cambia esto por un objeto para simular sesión activa

  React.useEffect(() => {
    const checkOrCreateUser = async () => {
        if (!user?.email) return;

        try {
            const res = await fetch(`${ENDPOINTS.USERS}?email=${user.email}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setDbUser(data[0]);
                    return;
                }
            }

            const newUser = {
                fullname: user.name,
                username: user.nickname,
                email: user.email,
                img_link: user.picture,
                is_admin: false,
                reputation: 0,
                score: 0,
                password: "google"
            };

            const createRes = await fetch(`${ENDPOINTS.USERS}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!createRes.ok) throw new Error("Error al crear usuario");

        } catch (error) {
            console.error("Error al comprobar o crear usuario:", error);
        }
    };

    checkOrCreateUser();
}, [user]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
    try {
      if (!dbUser?.id) return;

      const response = await fetch(`${ENDPOINTS.NOTIFICATIONS}/${dbUser.id}`);
      if (!response.ok) throw new Error("Error al obtener las notificaciones");

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };

  fetchNotifications();
  }, [dbUser]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
    
  };

  const handleCloseNotif = () => {
    setAnchorElNotif(null);
  };

  const markAllAsRead = async () => {
    if (!dbUser?.id) return;

    try {
      const response = await fetch(`${ENDPOINTS.NOTIFICATIONS}/mark_all_read/${dbUser.id}`, {
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error("No se pudo marcar como leídas");
      }

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const deleteAllNotifications = async () => {
    if (!dbUser?.id) return;

    try {
      const response = await fetch(`${ENDPOINTS.NOTIFICATIONS}/delete_all/${dbUser.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("No se pudieron eliminar las notificaciones");
      }

      setNotifications([]);
    } catch (error) {
      console.error("Error al eliminar las notificaciones:", error);
    }
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <NavLink to={`/${page.toLowerCase()}`}>{page}</NavLink>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <NavLink to={`/${page.toLowerCase()}`}>{page}</NavLink>
              </Button>
            ))}
          </Box>

          {!user ? (
            <Box className="flex justify-center items-center gap-x-2">
              <LoginButton/>
            </Box>
          ) : (
            <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notification button */}
            <Tooltip title="Notificaciones">
              <IconButton onClick={handleOpenNotif} color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            {/* Notification menu */}
            <Menu
              anchorEl={anchorElNotif}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotif}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  width: 370,
                  maxHeight: 400,
                  padding: 1,
                }
              }}
            >
              <Box className="flex justify-between items-center px-2 py-1 border-b border-gray-300">
                <Typography variant="subtitle1" className="font-semibold">Notificaciones</Typography>
                <Box>
                  <Tooltip title="Marcar todas como leídas">
                    <IconButton size="small" onClick={markAllAsRead}>
                      <DoneAll fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Borrar todas">
                    <IconButton size="small" onClick={deleteAllNotifications}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {notifications.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" className="text-center w-full">
                    No hay notificaciones
                  </Typography>
                </MenuItem>
              ) : (
                notifications.map((notif, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => {
                      handleCloseNotif();
                      if (notif.id_thread) {
                        window.location.href = `/thread/${notif.id_thread}`;
                      }
                    }}
                    sx={{
                      backgroundColor: notif.read ? 'transparent' : 'rgba(161, 161, 161, 0.36)',
                      borderRadius: 1,
                      mb: 0.5,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: notif.read ? 'rgba(0,0,0,0.04)' : 'rgba(25, 118, 210, 0.15)',
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={notif.read ? 'normal' : 'bold'}>
                        {notif.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notif.content}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>
          </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                  <MenuItem key={"profile"} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <NavLink to={`/profile`}><Button variant='text'>Profile</Button></NavLink>
                    </Typography>
                  </MenuItem>
                  <MenuItem key={"setting"} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <NavLink to={`/settings`}><Button variant='text'>Settings</Button></NavLink>
                    </Typography>
                  </MenuItem>
                  <MenuItem key={"Logout"} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <LogoutButton></LogoutButton>
                    </Typography>
                  </MenuItem>
              </Menu>
            </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
