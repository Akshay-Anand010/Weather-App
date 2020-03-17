const path=require('path')
const express=require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

const app= express()
const port = process.env.PORT || 3000
//define paths for express config
const publicdirpath=path.join(__dirname,'../public')
const viewspath=path.join(__dirname,'../templates/views')
const partialpath=path.join(__dirname,'../templates/partials')


//set up handle bars views and location
app.set('view engine','hbs')
app.set('views',viewspath)
hbs.registerPartials(partialpath)

//setup static directory to serve
app.use(express.static(publicdirpath))

app.get('',(req,res) =>{
    res.render('index',{
        title:'weather app',
        name:'Akshay Anand'
    })
})

app.get('/about',(req,res) =>{
    res.render('about',{
        title:'About me',
        name:'Akshay Anand'
    })
})


app.get('',(req,res) => {
   res.send('Hello this is Akshay')
     
})


// app.get('/help',(req,res) => {
//     res.send({
//         name:"Akshay",
//         age:22
//     })
// })

// app.get('/about',(req,res) => {
//     res.send('<h1>About</h1>')S
// })

app.get('/weather', (req, res) => {
    console.log(req.query)
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        console.log(latitude)


        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res) =>{
    if(!req.query.search){
       return res.send({
            error:'You must provide a search term.'
        })
    }
    res.send({
        products:[]
    })
})
app.get('/about/*',(req,res) =>{
    res.render('404',{
        title:'404',
        name:'Akshay Anand',
        error:'about article not found' 
    })
})

app.get('*',(req,res) =>{
res.render('404',{
    title:'404',
    name:'Akshay Anand',
    error:'Page not found' 
})
     
})



app.listen(3000, () =>{
    console.log('server running')
})