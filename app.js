//*********************************** Required Modules, view engine, middleware ******************************//

const express = require("express");
const fs = require('fs');
const path = require("path");

// The app
const app = express();

// register view engine
app.set("view engine", "ejs");
// app.set("views", "myviews"); //looks for views directory by default for .ejs files




// db
const f = "C:/Users/0235124/OneDrive - University of Waterloo/Desktop/main_testV4.0/jsonFiles/pick_tickets_signode.json";
const pdfdb = "C:/Users/0235124/OneDrive - University of Waterloo/Desktop/main_testV4.0/test/Markham";




// middleware
app.use(express.urlencoded({ extended: true })); // POST data is readable 
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(pdfdb));







//*********************************** ALL FUNCTIONS *************************************//

const jsonData = (f) => {
    return JSON.parse(fs.readFileSync(f));
};


const saveToJson = (f, data) => {
    data = JSON.stringify(data, null, 2);
    fs.writeFileSync(f, data);
};


const get_list_of_values = (key, set=false, file=f) =>{

    let data = jsonData(file);

    let arr = [];
    Object.entries(data).forEach(lst=>{

        arr.push(lst[1][key]);

    });

    if (set != false){
        return [...new Set(arr)];
    } else {
        return arr;
    }
    
};



const get_list_of_orders = (key, val, key1=null, val1=null, file=f)=> {

    let data = jsonData(file);

    let arr = [];

    if (key1==null && val1==null){

        Object.entries(data).forEach(lst=>{

            if (lst[1][key] == val) {
                arr.push(lst[0]);
            }
    
        });


    } else {

        Object.entries(data).forEach(lst=>{

            if (lst[1][key] == val && lst[1][key1] == val1) {
                arr.push(lst[0]);
            }
    
        });

    }

    return arr;

}



const files = Object.keys(jsonData(f)).map((order)=>{

    const url = jsonData(f)[order]["fileDirectory"].split("\\").join("/");
    const url_filter = url.replace(pdfdb, "");

    return {

        name: order,
        url: url_filter

    };

});





//***************************************** ALL ROUTES *************************************//


// "/"
app.get("/", (req, res)=>{
    res.redirect("/mainPage");
});



// /mainPage
app.get("/mainPage", (req, res)=>{

    lst = get_list_of_values("month", set=true);

    let data = jsonData(f);
    let orderList = Object.keys(data);


    context = {title: "Main Page", lst, data, orderList};

    res.render("mainPage", context);

});





// mainPage/allOrders
app.get("/mainPage/allOrders", (req, res)=>{

    let data = jsonData(f);
    let orderList = Object.keys(data);


    let context = {title:"All Orders", data, orderList};

    res.render("allOrders", context);

});




// mainPage/markham
app.get("/mainPage/markham", (req, res)=>{

    
    lst = get_list_of_values("month", set=true);

    context = {title: "Markham", lst};

    res.render("markham", context);


});



// mainPage/markham/:month
app.get("/mainPage/markham/:month", (req, res)=>{

    const month = req.params.month;
    data = jsonData(f);
    let lst_orders = get_list_of_orders("month", month);

    context = {title : month, lst_orders, data, month};

    res.render("monthlyView", context);

});




// mainPage/markham/:month/:status
app.get("/mainPage/markham/:month/:status", (req, res)=>{

    const month = req.params.month;
    const status = req.params.status;


    if (status == "AllOrders"){
        res.redirect(".");

    } else {

        data = jsonData(f)
        let lst_orders = get_list_of_orders("month", month, "status", status)

        context = {title: month, lst_orders, data, month, status};

        res.render("monthlyView", context);

    }

});



// Order details "all/:order"
app.get("/orders/:order", (req, res)=>{



    const order = req.params.order;
    const orderdata = jsonData(f)[order];


    const file = files.find((f) => f.name === order);

    let = context = {title : `${order}`, order, orderdata, file};

    res.render("orderDetails", context);

});






//********************************************* Tests only ***************************************/




// const path = require("path");
// const dirPath = path.join(__dirname, "public/pdfs");
// console.log(dirPath);
// const dirPath = path.join("C:/Users/0235124/OneDrive - University of Waterloo/Desktop/main_testV4.0/test/Markham", "public/pdfs");
// const dirPath = "C:/Users/0235124/OneDrive - University of Waterloo/Desktop/main_testV4.0/test/Markham";
// const files = fs.readdirSync(dirPath).map(name => {
    
//     return {
//       name: path.basename(name, ".pdf"),
//       url: `/pdfs/${name}`
//     };
//   });

// const files = Object.keys(jsonData(f)).map((order)=>{

//     const url = jsonData(f)[order]["fileDirectory"].split("\\").join("/");
//     const url_fil = url.replace(dirPath, "");
//     console.log(url_fil);

//     return {

//         name: order,
//         url: url_fil

//     };

// });

// // const temp = "C:/pickticket_test/OneDrive - Signode Industrial Group/picktestDrive/database/pick_tickets_signode/public";
// // const p = temp + "/pdfs/7183441-00.pdf"
// app.use(express.static("C:/Users/0235124/OneDrive - University of Waterloo/Desktop/main_testV4.0/test/Markham"));

// // app.use(
// //     express.static(temp, {
// //       setHeaders: (res, filepath) =>
// //         res.attachment(`pdf-express-${path.basename(filepath)}`)
// //     })
// //   );



// invalid routes
app.use((req, res) => {

    let = context = {title :"404 ERROR"}
    res.status(404).render('404', context);
});



// Listen 
const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log(`listening on PORT: ${PORT}`)
})





























// // Home page "/all"
// app.get("/all", (req, res) => {

//     let data = jsonData(f);
//     let orderList = Object.keys(data);

//     let = context = {title:"HOME", data, orderList};

//     res.render("index", context);

// });




// // Order details "all/:order"
// app.get("/all/:order", (req, res)=>{

//     const order = req.params.order;
//     const orderdata = jsonData(f)[order];

//     let = context = {title : `${order}`, order, orderdata};

//     res.render("orderDetails", context);

// });




// // Order modify "all/:order/modify"
// app.get("/all/:order/modify", (req, res)=>{

//     const order = req.params.order;
//     const orderdata = jsonData(f)[order];

//     let context = {title: `${order}`, order, orderdata};

//     res.render("orderModify", context);

// });



// // POST order modifications POST to "all/:order"
// app.post("/all/:order", (req, res)=>{
    
//     const order = req.params.order;

//     console.log(req.body);



//     res.redirect(`/all/${order}`);

// });






