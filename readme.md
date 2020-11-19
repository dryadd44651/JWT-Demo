### React: front end
### server: verify acess token and offer resource
### authServer: log in, token(update access token with refresh token), log out

**acess token: short lifetime (short: for safe reason)
***even acess token is steal by hacker, hacker can only access server in short period

**refresh token: long lifetime
***when acess token expired, use refresh token to update access token

authServer /login get acess token and refresh token

server /posts get data from server

get data several times...

server /posts fail (access expired)

authServer /token update access token

for lone while...


authServer /token fail

authServer /login get acess token and refresh token again

several operations...

authServer /logout remove refresh token from list

### token contain: header, payload,Verify Signature
> header: type(JWT), encode alg(HS256)
> payload: data(username), iat(issue at when),exp(expire time)
> Verify Signature: encoded data (encoded by key stored in server)

### situation: user already log out, but token still live.
> goal: make token invail, or hacker can use this token to access server.
> How to make a token invail, before it expired?


1. white list: only the refresh token in the list can access (authServer)
2. black list: the token only the list will be blocked
3. front end: clear token when log out.
   
   back end: make lifetime of token short, and do nothing.
   
   (easy but need both side operation)

1,2 can use radis to manage memory



