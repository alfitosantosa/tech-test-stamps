// fungsi untuk mengecek apakah sebuah angka adalah bilangan prima
function cekBilanganPrima(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

// fungsi utama FooBar
function Foobar() {
  // membuat array dari 1 sampai 100
  const nums = Array.from({ length: 100 }, (_, i) => i + 1);

  // array untuk menyimpan hasil
  const result = [];

  // proses dari 100 ke 1 (reverse order)
  for (let i = nums.length - 1; i >= 0; i--) {
    const num = nums[i];

    // skip bilangan prima
    if (cekBilanganPrima(num)) {
      continue;
    }

    // cek divisibilitas
    if (num % 3 === 0 && num % 5 === 0) {
      result.push("FooBar");
    } else if (num % 3 === 0) {
      result.push("Foo");
    } else if (num % 5 === 0) {
      result.push("Bar");
    } else {
      result.push(num);
    }
  }

  // print secara horizontal
  console.log(result.join(" "));
  return result.join(" ");
}

// jalankan fungsi
Foobar();
