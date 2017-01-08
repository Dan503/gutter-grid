
import { config, dirs } from '../shared-vars';

let generatedString;

if ( config.serve === 'php' ){
	generatedString = `
<?php
// redirect to base folder
header('Location: http://'.$_SERVER['HTTP_HOST'].'/${config.basePath}/'); exit();
?>
`;
} else {
	generatedString = `
<!DOCTYPE HTML>
<html>
<head><script>window.location.href = window.location.origin+'/${config.basePath}/'</script></head>
<body>
<!-- Backup for if the browser does not support JS -->
<p><a href="/${config.basePath}">Redirect</a></p>
</body>
</html>
`;

}

export default generatedString;