const verificationHtml = `<html>
<head>
  <style>
  #login{
    backgorund:lightgreen;
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
    font-size:2rem;
    font-family: Arial, Helvetica, sans-serif;
  }
  a{
    text-decoration: none;
    color: green;
    transition: all 500ms ease
  }
  a:hover {
    color: orange;
  }
  </style>
</head>
<body>
  <div id='login'>
    <p>The account has been verified. Please log in. </p>
    <br>
    <h2>Please log in <a href='http://localhost:4200/login'>login</a></h2>
  </div>
</body>
</html>`

module.exports = verificationHtml;