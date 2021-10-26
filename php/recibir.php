<?php

  include("conexion.php");

  $resultado = mysqli_query($conexion,"SELECT * from usuarios ORDER BY `usuarios`.`sala` ASC;");
  $data = [];
  while ($row = mysqli_fetch_assoc($resultado)) {
    $data[] = $row;
  }
  echo json_encode($data);
