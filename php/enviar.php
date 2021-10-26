<?php

  include("conexion.php"); // conexión a la base de datos

  header("Content-Type: application/json"); // tipo de dato que vamos a recibir
  $data = json_decode(file_get_contents("php://input"),true);
  $id = $data['id'];
  $nom = $data['nombre'];
  $forma = $data['estilo']['forma'];
  $col = $data['estilo']['color'];
  $x = $data['estilo']['pos']['x'];
  $y = $data['estilo']['pos']['y'];
  $z = $data['estilo']['pos']['z'];
  $sonido = $data['estilo']['sonido'];
  $tiemp = $data['tiempo'];
  $sala = $data['sala'];

  mysqli_query($conexion, "INSERT INTO
    usuarios (id,nombre,estilo_forma,estilo_color,estilo_pos_x,estilo_pos_y,estilo_pos_z,estilo_sonido,tiempo,fecha,sala)
    VALUES ('$id','$nom','$forma','$col','$x','$y','$z','$sonido','$tiemp', now(), '$sala')");

  echo "Subiendo dato a DB...";
?>
