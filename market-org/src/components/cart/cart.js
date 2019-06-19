import React, { useEffect, useState} from 'react'
import axios from '../../axios-instance';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import StripeCheckout from "react-stripe-checkout";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: '2rem',
  },
  cartItems: {
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    padding: '2rem'
  },

  headers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '75%',
    margin: '0 auto'

  },
  priceHeader: {
      marginRight: '20rem',
      fontSize: '1.3rem',
  },
  qtyHeader: {
    marginRight: '7rem',
    fontSize: '1.3rem',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-around',
    color: 'black',
  },
  subtotal: {
      fontSize: '2rem',
      textAlign: 'right',
      marginRight: '10rem',
      marginTop: '3rem',
  },
  checkout: {
      
      display: 'flex',
      justifyContent: 'center',
  },
  checkoutButton: {
    backgroundColor: '#F5885F',
    color: 'white',
     '&:hover': {
        backgroundColor: "lightgreen",
        color: 'white',
        border: '1px solid #F5885F'
     },
  }
}));

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState('')
    const [stripeId, setStripeId] = useState('')
    const [quantity, setQuantity] = useState(1)


    useEffect(() => {
        let firebase_id = localStorage.getItem('firebaseId')
        console.log(firebase_id)
        axios.get(`/cart/${firebase_id}`)
            .then(res => {
                console.log(res.data)
                let cartData = res.data.cartItem
                let total = res.data.total
                let stripe = res.data.cartItem[0].stripeAccountId
                console.log('Total', total)
                console.log('stripe', stripe)
                setCartItems(cartData)
                setTotal(total)
                setStripeId(stripe)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

      const handleChange = (event) => {
        const selectEvent = event
        setQuantity(oldValues => ({
          ...oldValues,
          [selectEvent.target.name]: selectEvent.target.value,
        }));
      }

      const removeFromCart = (cart_item_id) => {
         const firebase_id = localStorage.getItem('firebaseId')
        // axios.delete(`/cart/delete-stall-from-cart/${cart_item_id}`)
        axios.delete(`/cart/delete-stall-from-cart/${cart_item_id}`, {data: {cart_item_id: cart_item_id}})
        .then(res => {
          console.log(res, 'delete res')
          axios.get(`/cart/${firebase_id}`)
          .then(res => {
              console.log(res.data)
              let cartData = res.data.cartItem
              let total = res.data.total
              console.log('Total', total)
              console.log('cart data',  cartData)
              setCartItems(cartData)
              setTotal(total)
          })
          .catch(err => {
              console.log(err)
          })
        })
      

    }
    

   const handleToken = (token )  => {
    let amt = total
     let stripe_account = stripeId
    axios.post(
        "/cart/checkout",
        { token, amt, stripe_account }
      )
      .then(res => {
        console.log("Response:", res.data.status, )
        alert('payment completed')
        let firebase_id = localStorage.getItem('firebaseId')
        axios.get(`/cart/${firebase_id}`)
            .then(res => {
                console.log(res.data)
                let cartData = res.data.cartItem
                let total = res.data.total
                let stripe = res.data.cartItem[0].stripeAccountId
                console.log('Total', total)
                console.log('cart data',  cartData.cart_item_id)
                console.log('stripe', stripe)
                setCartItems(cartData)
                setTotal(total)
                setStripeId(stripe)
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        }) 
     
    }
    const classes = useStyles();
console.log(cartItems, 'cart items state')
    return (
        <div className={classes.root}>
            <Typography className={classes.title}>Shopping Cart</Typography>
            <div className={classes.headers}>
                <Typography className={classes.priceHeader}>Price</Typography>
                <Typography className={classes.qtyHeader}>Quantity</Typography>
           </div>
           
            {Object.keys(cartItems).map((item, i) => (
            <div  key={i}>
                {/* {setCartItems(cartItems.stripeAccountId)} */}
                {/* {console.log(cartItems[item].stalls_id, 'stripe')} */}
             <Grid container spacing={6} className={classes.cartItems}>
                <Grid item xs={10}>
                
                    <Paper className={classes.paper}>
                        <Typography variant="h6" component="h5">
                            Stall Dimensions: Length: {cartItems[item].size.length} ft. X  Width: {cartItems[item].size.width} ft.
                        </Typography>
                        <Typography variant="h6" component="h5">
                        
                            Stall Price: ${cartItems[item].price} 
                        </Typography>
           
                        <button onClick={() => removeFromCart(cartItems[item].cart_item_id)}>Remove From Cart</button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    ))
} 
         <Typography className={classes.subtotal}>Subtotal({cartItems.length} items): ${total}</Typography>
         <StripeCheckout
            stripeKey="pk_test_R4kvaWNKnku78DL2dwXpLiTq00R1MdFKhb"
            token={handleToken}
            amount={total * 100}
            name="Tesla Roadster"
            billingAddress
            shippingAddress
        />
       
        </div>

    )
}

export default Cart;