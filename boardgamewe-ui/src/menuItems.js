import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import {Link} from "react-router-dom";

export const menuItems = (
    <div>
        <Link to="/">
            <ListItem button>
                <ListItemText primary="Home" />
            </ListItem>
        </Link>

        <Link to="/boardgames">
            <ListItem button>
                 <ListItemText primary="Board Games" />
            </ListItem>
        </Link>
        <ListItem button>
            <ListItemText primary="Games" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Stats" />
        </ListItem>
    </div>
);