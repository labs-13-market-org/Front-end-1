import React, {useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from '../authContext/authState';
import { auth } from "../../firebase";
import axios from '../../axios-instance';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    //   display: 'flex',
    //   flexDirection: 'spaceAround',
    //   border: '1px solid red'
    },
    // menuButton: {
    //   marginRight: theme.spacing(2)
    // },
    title: {
      flexGrow: 1
    },
  links: {
    display: 'flex',
    justifyContent: 'space-around',
    // alignItems: 'spaceAround',
    margin: '0 auto',
    width: '80%',
    // border: '1px solid red'
  },
    appBar: {
      backgroundColor: "lightgreen"
    },
    navLink: {
        border: 'none'
    }
  }));

function VendorNav (props) {
    let firebase_id = localStorage.getItem('firebaseId')

    const viewMarket = () => {
        props.history.push('/markets')
    }

      const getCart = () => {
          let firebase_id = localStorage.getItem('firebaseId')
          props.history.push(`/cart/${firebase_id}`)
      console.log('click')
    // let firebase_id = localStorage.getItem('firebaseId')
    // console.log(firebase_id, 'from ger cart')
    // axios.get(`/cart/${firebase_id}`)
    // .then(res => {
    //     console.log(res)
    // })
    // .catch(err => {
    //     console.log(err)
    // })
  }
  const toPrivateVendorProfile = () => {    
    props.history.push(`/oneVendorPrivate/${firebase_id}`);
  };

  const logout = () => {
    auth.signOut();
    localStorage.clear();
    props.history.push("/");
  };

    console.log(props, 'props from vendor nav')
    const classes = useStyles();
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser, 'current user from vendor nav')
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="end"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.links}>
                    <Button
                        color="inherit"
                        className={classes.navLink}
                        onClick={() => {props.history.push('/landing-page')}}
                        // style={{  margin: "10px" }}
                     >
                        home
                    </Button>
                    <Button
                        color="inherit"
                        className={classes.navLink}
                        onClick={viewMarket}
                        // style={{  margin: "10px" }}
                     >
                        View Markets
                    </Button>

                    <Button
                        color="inherit"
                        className={classes.navLink}
                        // onClick={viewMarket}
                        // style={{  margin: "10px" }}
                     >
                        My Stalls
                    </Button>
                    <Button
                        color="inherit"
                        className={classes.navLink}
                        onClick={toPrivateVendorProfile}
                        // style={{  margin: "10px" }}
                     >
                        View My Vendor Profile
                    </Button>
                    <IconButton
                        edge="end"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Shopping cart"
                    >
                        <ShoppingCart onClick={getCart} />
                    </IconButton>
                    <Button
                        color="inherit"
                        className={classes.navLink}
                        onClick={logout}
                        // style={{  margin: "10px" }}
                     >
                        Log Out
                    </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default withRouter(VendorNav)