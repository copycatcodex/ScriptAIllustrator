// MEMBUAT WARNA
var userColor = new RGBColor();
userColor.red = 255; // Komponen merah
userColor.green = 0; // Komponen hijau
userColor.blue = 0; // Komponen biru

// MEMILIH SEMUA OBJEK YANG DIPILIH
var selectedObjects = app.activeDocument.selection;

// GRUP NOMOR
var groupCount = 1;

// Meminta konfirmasi dari pengguna
var continueScript = confirm("Pastikan Objek memiliki outline berwarna bebas dan tidak di grup");
if (continueScript) {
  // Skrip akan berlanjut hanya jika pengguna memilih "Ya"

  // Cek apakah ada objek yang dipilih
  if (selectedObjects.length > 0) {
    // Meminta pengguna untuk memasukkan warna
    var userInput = prompt("Masukkan warna RGB (contoh: 255,0,0 untuk merah):", "255,0,0");
    
    // Memisahkan nilai RGB yang dimasukkan pengguna
    var rgbValues = userInput.split(",");
    
    // Mengecek apakah pengguna memasukkan 3 nilai RGB yang valid
    if (rgbValues.length === 3 && !isNaN(rgbValues[0]) && !isNaN(rgbValues[1]) && !isNaN(rgbValues[2])) {
      // Membuat warna dari nilai-nilai yang dimasukkan pengguna
      var userColor = new RGBColor();
      userColor.red = parseFloat(rgbValues[0]);
      userColor.green = parseFloat(rgbValues[1]);
      userColor.blue = parseFloat(rgbValues[2]);

      for (var j = 0; j < selectedObjects.length; j++) {
        var selectedObject = selectedObjects[j];

        //======= MEMERIKSA OBJEK YANG DIPILIH (PATH) =======
        if (selectedObject && selectedObject.typename === "PathItem") {
          var newGroup = app.activeDocument.groupItems.add(); // Membuat grup baru

          // SECTION 1 COPY OBJEK
          // Membuat salinan hanya outline objek dengan warna yang dimasukkan oleh pengguna
          var outlineObject = selectedObject.duplicate();
          outlineObject.filled = false; // Menghapus pengisian (fill) pada salinan
          outlineObject.stroked = true; // Menyimpan outline (stroke) pada salinan

          // Mengatur warna outline menjadi warna yang dimasukkan oleh pengguna
          outlineObject.strokeColor = userColor;

          // Mengatur ketebalan outline menjadi 0.25pt
          outlineObject.strokeWidth = 0.25;
          outlineObject.moveToEnd(newGroup); // Memindahkan outline ke dalam grup

      // SECTION 2 GARIS DARI HANDLE
      for (var i = 0; i < selectedObject.pathPoints.length; i++) {
        var pathPoint = selectedObject.pathPoints[i];

        // Membuat objek garis dari handle kiri
        var lineLeft = app.activeDocument.pathItems.add();
        lineLeft.setEntirePath([
          [pathPoint.anchor[0], pathPoint.anchor[1]], // Titik awal
          [pathPoint.leftDirection[0], pathPoint.leftDirection[1]] // Titik akhir (handle kiri)
        ]);

        // Set warna garis menjadi merah (RGB)
        lineLeft.strokeColor = userColor
        
        lineLeft.strokeWidth = 0.25; // Ketebalan garis 0.25pt
        lineLeft.filled = false; // Tidak ada fill color
        lineLeft.moveToEnd(newGroup); // Memindahkan garis ke dalam grup

        // Membuat objek garis dari handle kanan
        var lineRight = app.activeDocument.pathItems.add();
        lineRight.setEntirePath([
          [pathPoint.anchor[0], pathPoint.anchor[1]], // Titik awal
          [pathPoint.rightDirection[0], pathPoint.rightDirection[1]] // Titik akhir (handle kanan)
        ]);

        // Set warna garis menjadi merah (RGB)
        lineRight.strokeColor = userColor;
        lineRight.strokeWidth = 0.25; // Ketebalan garis 0.25pt
        lineRight.filled = false; // Tidak ada fill color
        lineRight.moveToEnd(newGroup); // Memindahkan garis ke dalam grup
      }

      // SECTION 3 HANDLE JADI LINGKARAN
      for (var i = 0; i < selectedObject.pathPoints.length; i++) {
        var pathPoint = selectedObject.pathPoints[i];

        // Membuat objek square dari handle kiri
        var squareLeft = app.activeDocument.pathItems.ellipse(
          pathPoint.leftDirection[1] - -1.5, // Y-coordinate
          pathPoint.leftDirection[0] - 1.5, // X-coordinate
          3, // Lebar square
          3 // Tinggi square
        );
        // Set warna garis menjadi merah (RGB)
        squareLeft.fillColor = userColor; // Warna square sesuai dengan objek asli
        squareLeft.stroked = false; // Tidak ada stroke pada square
        squareLeft.moveToEnd(newGroup); // Memindahkan square ke dalam grup

        // Membuat objek square dari handle kanan
        var squareRight = app.activeDocument.pathItems.ellipse(
          pathPoint.rightDirection[1] - -1.5, // Y-coordinate
          pathPoint.rightDirection[0] - 1.5, // X-coordinate
          3, // Lebar square
          3 // Tinggi square
        );

        squareRight.fillColor = userColor; // Warna square sesuai dengan fill objek asli
        squareRight.stroked = false; // Tidak ada stroke pada square
        squareRight.moveToEnd(newGroup); // Memindahkan square ke dalam grup
      }

      // SECTION 4 ANCHOR JADI PERSEGI
      for (var i = 0; i < selectedObject.pathPoints.length; i++) {
        var pathPoint = selectedObject.pathPoints[i];
        var nodeCircle = app.activeDocument.pathItems.rectangle(
          pathPoint.anchor[1] - -1.5, // Y-coordinate
          pathPoint.anchor[0] + -1.5, // X-coordinate
          3, // Lebar lingkaran
          3 // Tinggi lingkaran
        );

        nodeCircle.fillColor = userColor; // Set warna garis menjadi merah (RGB)
        nodeCircle.stroked = false; // Tidak ada stroke pada lingkaran
        nodeCircle.moveToEnd(newGroup); // Memindahkan lingkaran ke dalam grup
      }

      // Memberi nama pada grup dengan nomor urutan
      newGroup.name = "berhasil " + groupCount;
      groupCount++; // Menambah nomor urutan grup
      // Menghapus objek asli
      selectedObject.remove();
    } else {
      alert("Objek ke-" + (j + 1) + " bukan objek path.");
    }
  }
} else {
  alert("Masukkan warna RGB yang valid (format: 255,0,0 untuk merah).");
}
} else {
alert("Tidak ada objek yang dipilih.");
}
} else {
alert("Proses dibatalkan.");
}
