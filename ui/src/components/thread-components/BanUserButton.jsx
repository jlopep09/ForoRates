import { IconButton, CardActions, Tooltip } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";

function BanUserButton({ user, onToggleBan }) {
  return (
    <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1 }}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onToggleBan(); }}>
        <Tooltip title={user.is_banned ? "Desbanear usuario" : "Banear usuario"}>
          <IconButton
            color={user.is_banned ? "secondary" : "error"}
            size="small"
          >
            {user.is_banned ? <CheckCircleIcon /> : <BlockIcon />}
          </IconButton>
        </Tooltip>
        <span className="text-sm text-white">
          {user.is_banned ? "Desbanear usuario" : "Banear usuario"}
        </span>
      </div>
    </CardActions>
  );
}

export default BanUserButton;
