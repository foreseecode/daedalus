function myFunction() {
  var x = document.getElementById("mainnav");
  if (x.className === "main-nav") {
    x.className += " responsive";
  } else {
    x.className = "main-nav";
  }
}

$("#sizing div").click(function() {
  $("#sizing div")
    .not(this)
    .removeClass("size");
  $(this).toggleClass("size");
});

$(function() {
  $(".add-to-cart").click(function() {
    $(".alert").show();
    return false;
  });
});

$(function() {
  $(".apply-coupon").click(function() {
    $(".alertcode").show();
    return false;
  });
});

$(function() {
  $(".closebtn2").click(function() {
    $(".alertcode").hide();
    return false;
  });
});

$(function() {
  $(".closebtn").click(function() {
    $(".alert").hide();
    return false;
  });
});
