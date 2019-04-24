function myFunction() {
  var x = document.getElementById("mainnav");
  if (x.className === "main-nav") {
    x.className += " responsive";
  } else {
    x.className = "main-nav";
  }
}

$(function() {
  $("#sizing div").click(function() {
    $("#sizing div")
      .not(this)
      .removeClass("size");
    $(this).toggleClass("size");
  });

  $(".add-to-cart").click(function() {
    $(".alert").show();
    return false;
  });

  $(".apply-coupon").click(function() {
    $(".alertcode").show();
    return false;
  });

  $(".closebtn2").click(function() {
    $(".alertcode").hide();
    return false;
  });

  $(".closebtn").click(function() {
    $(".alert").hide();
    return false;
  });
});
