<!-- app/views/equipos/index.php -->
<?php
/**
 * @var array $datos
 */
?>
<h1><?php echo $datos['titulo']; ?></h1>

<div style="margin-bottom: 15px;">
    <a href="/equipos/crear" style="padding: 10px; background-color: #28a745; color: white; text-decoration: none;">+ Crear Nuevo Equipo</a>
</div>

<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach($datos['equipos'] as $equipo) : ?>
        <tr>
           
            <td><?php echo $equipo['id']; ?></td>
            <td><?php echo $equipo['nombre']; ?></td>
            <td><?php echo $equipo['decripcion']; ?></td>
            <td>
                <a href="/equipos/editar/<?php echo $equipo['id']; ?>" style="color: blue;">Editar</a> | 
                <form action="/equipos/eliminar/<?php echo $equipo['id']; ?>" method="POST" ...>
                    <button type="submit" style="color: red; background: none; border: none; cursor: pointer; text-decoration: underline;">Eliminar</button>
                </form>
            </td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>