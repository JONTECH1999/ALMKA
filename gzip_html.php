<?php
$html = '<!DOCTYPE html>
<html>
<head>
    <title>ALMKA Device Stream</title>
</head>
<body>
    <h1>ALMKA Device Live Stream</h1>
    <img src="/stream" alt="Live Stream" style="max-width: 100%; height: auto;" />
</body>
</html>';

$gzipped = gzencode($html, 9);
$len = strlen($gzipped);

echo "//File: index_ov2640.html.gz, Size: $len\n";
echo "#define index_ov2640_html_gz_len $len\n";
echo "const unsigned char index_ov2640_html_gz[] = {\n";

for ($i = 0; $i < $len; $i++) {
    if ($i % 16 == 0) echo "  ";
    printf("0x%02X", ord($gzipped[$i]));
    if ($i < $len - 1) echo ",";
    if ($i % 16 == 15) echo "\n";
    else echo " ";
}

echo "\n};\n";
?>