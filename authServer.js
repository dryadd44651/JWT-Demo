require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
var methodOverride = require('method-override');
const cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(methodOverride('_method'));
let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //refreshToken expired
    if (err){
      //delete from refreshTokens
      let idx = refreshTokens.indexOf(refreshToken);
      refreshTokens.splice(idx, 1);
      return res.sendStatus(403)
    }
     
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  let idx = refreshTokens.indexOf(req.body.token);
  if(idx>-1){
    refreshTokens.splice(idx, 1);
    res.json({ message: 'success' })
  }
  else
    res.sendStatus(204)
  //refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '20s' })
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)