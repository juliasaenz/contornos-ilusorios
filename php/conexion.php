<?php
 // Conexión con una base de datos en mySQL
  // probando localmente estos se mantienen igual
  $server = "localhost";
  $user = "root";
  $pass = "";
  // el nombre que le hayas puesto a tu base de datos en mySQL
  $db = "obraTesina";

  $conexion= new mysqli($server,$user,$pass,$db);

  if($conexion->connect_errno){
    // aviso si fallo la conexión
    die("Fallo en la conexión". $conexion->connect_errno);
  } else {
    //conexión exitosa
  }
