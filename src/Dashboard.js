/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Row, Card } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css"


//Creadintials for Demo pupose put there
// we have to put it in .env file
const CLIENT_ID = "fe97e9f15b504f32bbbd9ac307de9527";
const CLIENT_SECRET = "aa1cf386fd2440d19024c2898ec6f93c";

export default function Dashboard() {
  const [SearchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [album, setAlbum] = useState([]);
  const [market, setMarket] = useState([]);

  useEffect(() => {
    //Api Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    //getting the AccessToken
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  });

  //search functionality
  async function search() {
    // console.log('searching' + SearchInput);

    //Get request parameters using search to get artist_id
    var artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
    }
//Get request parameters using search to get Market parameters
    var marketParameters = {
      method: 'GET',
      headers : {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var marketID = await fetch("https://api.spotify.com/v1/markets?q=" + market + '&type=markets', marketParameters)
    .then(response => response.json())
    // .then(data => console.log(data))

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + SearchInput + '&type=artist', artistParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    // console.log("Artist Id is" + artistID);

    //Get request with artist ID grab all album from artist
    var returnedAlbum = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', artistParameters)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setAlbum(data.items)
      })



    //display artist album

    //Get Available MArkets
    var Available_Markets = await fetch('https://api.spotify.com/v1/markets')
    .then(response => response.json())
      .then(data => {
        // console.log(data);
        setMarket(data.items)
      })

  }

  return (

    <div className="App">
      <Container>
        <InputGroup className="mb-3 mt-5" size="lg">
          <FormControl
            placeholder="Search..."
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                // console.log("Pressed Enter");
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
          
        </InputGroup>
      </Container>
      <Container>
      {/* Display in a row */}
        <Row className="mx-2 row row-cols-5">
          {album.map((album, index) => {
            return (
              <Card>
                <Card.Img src={album.images[2].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}

        </Row>
      </Container>
    </div>


  )
}

