import express from "express";
import axios from "axios";
import bodyParser from "body-parser"

const app = express();
const port = 3000;
const listOfDishes = ["main course",
  "side dish",
  "dessert",
  "appetizer",
  "salad",
  "bread",
  "breakfast",
  "soup",
  "beverage",
  "sauce",
  "marinade",
  "fingerfood",
  "snack",
  "drink"];

const listOfCuisines = ["African",
"Asian",
"American",
"British",
"Cajun",
"Caribbean",
"Chinese",
"Eastern European",
"European",
"French",
"German",
"Greek",
"Indian",
"Irish",
"Italian",
"Japanese",
"Jewish",
"Korean",
"Latin American",
"Mediterranean",
"Mexican",
"Middle Eastern",
"Nordic",
"Southern",
"Spanish",
"Thai",
"Vietnamese"]
var api = "https://api.spoonacular.com/recipes/random?"
var apiKey = "apiKey=2829fc021a5446f999ca3aa51b9afe03"
var query = ""
var searchType = ""

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(queryString)

function queryString(req, res, next) {
  let dish = req.body["dishType"]
  let cuisine = req.body["cuisineType"]
  // let keyword = req.body["keyword"]
  // if(keyword) {
  //   api += `autocomplete?apiKey=2829fc021a5446f999ca3aa51b9afe03&number=1&query=${keyword}include-tags=`
  // }
  // else{
    // api += "random?apiKey=2829fc021a5446f999ca3aa51b9afe03&number=1&include-tags="
  // }
  query = `&number=1&include-tags=${dish},${cuisine}`.toLowerCase()
  if(!dish && !cuisine ) query = ""
  console.log(`${api}${apiKey}${query}`)
  next();
}

app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://api.spoonacular.com/recipes/random?apiKey=2829fc021a5446f999ca3aa51b9afe03");
    console.log(result.data);
    res.render("index.ejs", {
      dish: result.data.recipes[0].dishTypes[0],
      cuisine: result.data.recipes[0].cuisines[0],
      image: result.data.recipes[0].image,
      name: result.data.recipes[0].title,
      summary: result.data.recipes[0].summary,
      dishList: listOfDishes,
      cuisineList: listOfCuisines,
    });
  } catch (error) {
    
    res.status(500);
  }
});

app.post("/check", async (req, res) => {
    try{ 
      const result = await axios.get(`${api}${apiKey}${query}`);
      console.log(result.data, result.data.recipes[0].dishTypes, result.data.recipes[0].cuisines);
      res.render("index.ejs", {
        dish: result.data.recipes[0].dishTypes[0],
        cuisine: result.data.recipes[0].cuisines[0],
        image: result.data.recipes[0].image,
        name: result.data.recipes[0].title,
        summary: result.data.recipes[0].summary,
        dishList: listOfDishes,
        cuisineList: listOfCuisines,
      });
    } catch (error) {
        if(error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message);
        }
      res.status(500);
      res.redirect("/")
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
