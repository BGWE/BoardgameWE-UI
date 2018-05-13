import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import {Link} from "react-router-dom";

export const menuItems = (
    <div>
        <Link style={{ textDecoration: 'none' }} to="/boardgames">
            <ListItem button>
                 <ListItemText primary="Board Games" />
            </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} to="/players">
            <ListItem button>
                <ListItemText primary="Players" />
            </ListItem>
        </Link>

        <Link style={{ textDecoration: 'none' }} to="/games">
            <ListItem button>
                <ListItemText primary="Games" />
            </ListItem>
        </Link>
        <ListItem button>
            <ListItemText primary="Stats" />
        </ListItem>
    </div>
);