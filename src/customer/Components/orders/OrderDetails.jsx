import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import OrderTraker from "./OrderTraker";
import StarIcon from "@mui/icons-material/Star";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import AddressCard from "../adreess/AdreessCard";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { getOrderById } from "../../../Redux/Customers/Order/Action";
import BackdropComponent from "../BackDrop/Backdrop";
// import { ordersById } from "../../../action";
import { getOrderById } from "../../../action/cart";
import AddressCard from "../adreess/AdreessCard";
import { receiveProductsById } from "../../../action";
import Loader from "../Loader/Loader";
const OrderDetails = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  // const { orderId } = useParams();
  const { order } = useSelector((store) => store);

  const [linesData, setLinesData] = useState();
  const [address, setAddress] = useState({});
  // const [productDetails, setProductDetails] = useState({});
  const [productDetails, setProductDetails] = useState([]);

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const urlParams = new URLSearchParams(location.search);
  // Extract orderId from the URL pathname
  const orderId = location.pathname.split("/").pop();
  // Extract key from the query parameters
  const key = urlParams.get("key");

  console.log("order", linesData);
  // const orderIdURL = `gid://shopify/Order/${orderId}?key=${key}`;
  useEffect(() => {
    // dispatch(getOrderById(orderId));
    getOrderById(orderId).then((res) => {
      console.log("this is order detials page1", res);
      setLinesData(res);
    });
  }, []);

  useEffect(() => {
    // const address = {
    //   firstName: linesData?.orderItem?.[0]?.firstName,
    //   lastName: linesData?.orderItem?.[0]?.lastName,
    //   addressLine: [
    //     linesData?.orderItem?.[0]?.addressLine[0],
    //     linesData?.orderItem?.[0]?.addressLine[1],
    //   ],
    //   city: linesData?.orderItem?.[0]?.city,
    //   state: linesData?.orderItem?.[0]?.state,
    //   zipCode: linesData?.orderItem?.[0]?.zipCode,
    //   phone1: linesData?.orderItem?.[0]?.phone1,
    //   email1: linesData?.orderItem?.[0]?.email1,
    // };

    setAddress({
      firstName: linesData?.orderItem?.[0]?.firstName,
      lastName: linesData?.orderItem?.[0]?.lastName,
      addressLine: [
        linesData?.orderItem?.[0]?.addressLine[0],
        linesData?.orderItem?.[0]?.addressLine[1],
      ],
      city: linesData?.orderItem?.[0]?.city,
      state: linesData?.orderItem?.[0]?.state,
      zipCode: linesData?.orderItem?.[0]?.zipCode,
      phone1: linesData?.orderItem?.[0]?.phone1,
      email1: linesData?.orderItem?.[0]?.email1,
    });
  }, [linesData]);
  // useEffect(() => {
  //   // const item = linesData?.orderItem?.[0];
  //   const item = linesData?.orderItem?.map((item) => item) || [];
  //   console.log("item", item);

  //   const status = linesData?.orderStatus;
  //   setStatus(status);
  //   if (item?.productId) {
  //     console.log("item", item);

  //     receiveProductsById(item.productId).then((res) => {
  //       if (res && res.catalogEntryView && res.catalogEntryView.length > 0) {
  //         const product = res.catalogEntryView[0];
  //         setProductDetails(product);

  //         setLoading(false);
  //       }
  //     });
  //   }
  // }, [linesData, productDetails]);

  useEffect(() => {
    const items = linesData?.orderItem || [];
    console.log("items", items);

    const status = linesData?.orderStatus;
    setStatus(status);

    // Check if items array has any product IDs to fetch
    if (items.length > 0) {
      const fetchProductDetails = async () => {
        const products = await Promise.all(
          items.map(async (item) => {
            if (item.productId) {
              console.log("Fetching details for item", item);
              const res = await receiveProductsById(item.productId);
              if (
                res &&
                res.catalogEntryView &&
                res.catalogEntryView.length > 0
              ) {
                return { ...res.catalogEntryView[0], quantity: item.quantity };
              }
            }
            return null;
          })
        );

        // Filter out any null values and update productDetails
        setProductDetails(products.filter((product) => product !== null));
        setLoading(false);
      };

      fetchProductDetails();
    }
  }, [linesData, productDetails, linesData?.orderItem?.length]);

  const navigate = useNavigate();
  return (
    <>
      {linesData &&
        (loading ? (
          <Loader />
        ) : (
          <>
            <div className=" px-2 lg:px-36 space-y-7 mt-10">
              <Grid container className="p-3 shadow-lg">
                <Grid item xs={12}>
                  {/* <p className="font-bold text-lg py-2">Shipping Address</p> */}
                </Grid>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex justify-center">
                    <AddressCard address={address} title={"Shipping Address"} />
                  </div>
                  <div className="flex justify-center">
                    <AddressCard address={address} title={"Billing Address"} />
                  </div>
                </div>
              </Grid>
              <Box className="p-5 shadow-lg border rounded-md">
                <Grid
                  container
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Grid item xs={9}>
                    <OrderTraker
                      activeStep={
                        status === "M"
                          ? 1
                          : status === "M"
                          ? 2
                          : linesData?.fulfillmentStatus === "UNFULFILLED"
                          ? 3
                          : 5
                      }
                    />
                  </Grid>
                  <Grid item>
                    {linesData?.fulfillmentStatus === "FULFILLED" && (
                      <Button sx={{ color: "" }} color="error" variant="text">
                        RETURN
                      </Button>
                    )}

                    {linesData?.fulfillmentStatus !== "FULFILLED" && (
                      <Button sx={{ color: deepPurple[500] }} variant="text">
                        cancel order
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>

              <Grid container className="space-y-5">
                {linesData &&
                  // linesData?.orderItem?.length > 0 &&
                  // linesData?.orderItem?.map((item) => (
                  productDetails?.length > 0 &&
                  productDetails?.map((item) => (
                    <Grid
                      container
                      item
                      className="shadow-xl rounded-md p-5 border"
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid item xs={6}>
                        {" "}
                        <div className="flex  items-center ">
                          <img
                            className="w-[7rem] h-[7rem] object-contain object-top"
                            src={item?.thumbnail}
                            alt=""
                          />
                          <div className="ml-5 space-y-2">
                            <p className="">{item?.name}</p>
                            {/* <p className="opacity-50 text-xs font-semibold space-x-5">
                    <span>Color: pink</span> <span>Size: {item.size}</span>
                  </p> */}
                            <p>Quantity: {parseInt(item?.quantity)}</p>
                            <p>
                              {" "}
                              $
                              {item?.price?.[0]?.value *
                                parseInt(item?.quantity)}
                            </p>
                          </div>
                        </div>
                      </Grid>
                      <Grid item>
                        {
                          <Box
                            sx={{ color: deepPurple[500] }}
                            onClick={() =>
                              navigate(`/account/rate/${item.product._id}`)
                            }
                            className="flex items-center cursor-pointer"
                          >
                            <StarIcon
                              sx={{ fontSize: "2rem" }}
                              className="px-2 text-5xl"
                            />
                            <span>Rate & Review Product</span>
                          </Box>
                        }
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </>
        ))}
      <BackdropComponent open={false} />
    </>
  );
};
// sx={{width:"10px",height:"10px"}}
export default OrderDetails;
