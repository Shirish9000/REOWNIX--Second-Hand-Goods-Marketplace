// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import DataTable from "../components/admin/DataTable";
import adminApi from "../services/adminApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { useTheme } from "@mui/material/styles";


const MetricCard = ({ title, value }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>

    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      {value}
    </Typography>
  </Paper>
);


const chartColors = [
  "#2563EB",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
];


const AdminDashboard = () => {

  const theme = useTheme();

  const [tab,setTab] = useState(0);
  const [search,setSearch] = useState("");

  const [page,setPage] = useState(0);
  const [pageSize,setPageSize] = useState(10);

  const [rows,setRows] = useState([]);
  const [rowCount,setRowCount] = useState(0);

  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);


  const [metrics,setMetrics] = useState({
    totalUsers:0,
    totalProducts:0,
    activeAuctions:0,
    completedAuctions:0
  });


  const [metricsLoading,setMetricsLoading] = useState(false);
  const [metricsError,setMetricsError] = useState(null);



  const [chartData,setChartData] = useState({

    usersByMonth:[],
    productsByCategory:[],
    productsByMonth:[],
    auctionStatus:[],
    auctionsByMonth:[]

  });


  const entityMap=[
    "users",
    "products",
    "auctions",
    "categories",
    "reviews"
  ];


  const currentEntity = entityMap[tab];



  const columnDefs = {

    users:[
      {
        field:"id",
        headerName:"ID",
        width:80
      },
      {
        field:"name",
        headerName:"Name",
        flex:1
      },
      {
        field:"email",
        headerName:"Email",
        flex:1
      },
      {
        field:"phone",
        headerName:"Phone",
        width:130
      }
    ],


    products:[
      {
        field:"id",
        headerName:"ID"
      },
      {
        field:"title",
        headerName:"Title",
        flex:1
      },
      {
        field:"category",
        headerName:"Category"
      }
    ],


    auctions:[
      {
        field:"id",
        headerName:"ID"
      },
      {
        field:"product",
        headerName:"Product"
      }
    ],


    categories:[
      {
        field:"id",
        headerName:"ID"
      },
      {
        field:"name",
        headerName:"Name"
      }
    ],


    reviews:[
      {
        field:"id",
        headerName:"ID"
      },
      {
        field:"comment",
        headerName:"Comment"
      }
    ]

  };
    // ===============================
  // LOAD TABLE DATA
  // ===============================

  useEffect(() => {

    setLoading(true);
    setError(null);


    const params = {
      page: page + 1,
      limit: pageSize,
      search
    };


    const fetchMap = {

      users: adminApi.getUsers,
      products: adminApi.getProducts,
      auctions: adminApi.getAuctions,
      categories: adminApi.getCategories,
      reviews: adminApi.getReviews

    };


    const fetchFn = fetchMap[currentEntity];


    fetchFn(params)

      .then((data)=>{


        // supports both:
        // {items:[], total:10}
        // []
        
        if(Array.isArray(data)){

          setRows(data);
          setRowCount(data.length);

        }
        else{

          setRows(data?.items || []);
          setRowCount(data?.total || 0);

        }


      })

      .catch((err)=>{

        console.error(err);
        setError(err);

      })

      .finally(()=>{

        setLoading(false);

      });


  },[
    currentEntity,
    page,
    pageSize,
    search
  ]);





  // ===============================
  // LOAD METRICS
  // ===============================

  useEffect(()=>{


    setMetricsLoading(true);


    const types=[
      "totalUsers",
      "totalProducts",
      "activeAuctions",
      "completedAuctions"
    ];


    Promise.all(
      types.map((type)=>
        adminApi.getMetrics(type)
      )
    )


    .then((results)=>{


      const obj={};


      types.forEach((type,index)=>{


        const value = results[index];


        // handles:
        // 10
        // {value:10}

        obj[type] =
          typeof value === "object"
          ? value.value ?? 0
          : value ?? 0;


      });


      setMetrics(obj);


    })


    .catch((err)=>{

      setMetricsError(err);

    })


    .finally(()=>{

      setMetricsLoading(false);

    });


  },[]);





  // ===============================
  // LOAD CHART DATA
  // ===============================


  useEffect(()=>{


    const requests=[

      adminApi.getMetrics("usersByMonth"),

      adminApi.getMetrics("productsByCategory"),

      adminApi.getMetrics("productsByMonth"),

      adminApi.getMetrics("auctionStatus"),

      adminApi.getMetrics("auctionsByMonth")

    ];



    Promise.all(requests)

    .then(
      ([
        users,
        products,
        productMonth,
        auctionStatus,
        auctionMonth

      ])=>{


        setChartData({

          usersByMonth:
            Array.isArray(users)
            ? users
            : [],


          productsByCategory:
            Array.isArray(products)
            ? products
            : [],


          productsByMonth:
            Array.isArray(productMonth)
            ? productMonth
            : [],


          auctionStatus:
            Array.isArray(auctionStatus)
            ? auctionStatus
            : [],


          auctionsByMonth:
            Array.isArray(auctionMonth)
            ? auctionMonth
            : []

        });


      }

    )


    .catch(err=>{

      console.error(
        "Chart error",
        err
      );

    });



  },[]);





  const handleTabChange=(event,newValue)=>{


    setTab(newValue);

    setPage(0);

    setSearch("");

  };
    return (

    <Box sx={{display:"flex"}}>


      <AdminSidebar />


      <Box
        component="main"
        sx={{
          flexGrow:1,
          p:{
            xs:2,
            md:4
          }
        }}
      >


        {/* Metrics */}

        <Grid container spacing={2} sx={{mb:4}}>


          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers ?? "-"}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Products"
              value={metrics.totalProducts ?? "-"}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Auctions"
              value={metrics.activeAuctions ?? "-"}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Completed Auctions"
              value={metrics.completedAuctions ?? "-"}
            />
          </Grid>


        </Grid>





        {/* Tabs */}


        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
        >

          <Tab label="Users"/>
          <Tab label="Products"/>
          <Tab label="Auctions"/>
          <Tab label="Categories"/>
          <Tab label="Reviews"/>

        </Tabs>





        {/* Search */}


        <Box sx={{my:2}}>

          <TextField

            placeholder="Search..."

            size="small"

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

          />

        </Box>





        {
          error &&
          <Alert severity="error">
            Failed to load data.
          </Alert>
        }





        <DataTable

          columns={
            columnDefs[currentEntity]
          }

          rows={rows}

          loading={loading}

          error={error}

          page={page}

          pageSize={pageSize}

          rowCount={rowCount}


          onPageChange={(newPage)=>
            setPage(newPage)
          }


          onPageSizeChange={(newSize)=>{

            setPageSize(newSize);

            setPage(0);

          }}

        />







        {/* Charts */}


        <Box sx={{mt:4}}>


          <Grid container spacing={4}>


            <Grid item xs={12} md={6}>

              <Paper sx={{p:2}}>


                <Typography variant="h6">

                  Users Added Per Month

                </Typography>



                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <LineChart
                    data={
                      chartData.usersByMonth
                    }
                  >

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line
                      dataKey="count"
                      type="monotone"
                      stroke={
                        theme.palette.primary.main
                      }
                    />


                  </LineChart>


                </ResponsiveContainer>


              </Paper>


            </Grid>





            <Grid item xs={12} md={6}>


              <Paper sx={{p:2}}>


                <Typography variant="h6">

                  Products By Category

                </Typography>



                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <PieChart>


                    <Pie

                      data={
                        Array.isArray(
                          chartData.productsByCategory
                        )
                        ?
                        chartData.productsByCategory
                        :
                        []
                      }

                      dataKey="count"

                      nameKey="category"

                      outerRadius={80}

                    >


                      {
                        chartData.productsByCategory.map(
                          (_,index)=>(

                            <Cell

                              key={index}

                              fill={
                                chartColors[
                                  index %
                                  chartColors.length
                                ]
                              }

                            />

                          )
                        )
                      }


                    </Pie>


                    <Tooltip/>


                  </PieChart>


                </ResponsiveContainer>


              </Paper>


            </Grid>







            <Grid item xs={12} md={6}>


              <Paper sx={{p:2}}>


                <Typography variant="h6">

                  Auction Status

                </Typography>


                <ResponsiveContainer
                  width="100%"
                  height={250}
                >


                  <PieChart>


                    <Pie

                      data={
                        chartData.auctionStatus
                      }

                      dataKey="count"

                      nameKey="status"

                      outerRadius={80}

                    />


                    <Tooltip/>


                  </PieChart>


                </ResponsiveContainer>


              </Paper>


            </Grid>






            <Grid item xs={12} md={6}>


              <Paper sx={{p:2}}>


                <Typography variant="h6">

                  Auctions Created Per Month

                </Typography>



                <ResponsiveContainer
                  width="100%"
                  height={250}
                >


                  <BarChart
                    data={
                      chartData.auctionsByMonth
                    }
                  >


                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>


                    <Bar
                      dataKey="count"
                      fill={
                        theme.palette.secondary.main
                      }
                    />


                  </BarChart>


                </ResponsiveContainer>


              </Paper>


            </Grid>



          </Grid>


        </Box>



      </Box>


    </Box>

  );


};


export default AdminDashboard;