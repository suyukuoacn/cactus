describe("Calculator", function () {
  // inject the HTML fixture for the tests
  beforeEach(function () {
    var fixture =
      '<div id="fixture"><input id="payload" type="text">' +
      '<input id="sign" type="button" value="Sign">' +
      'Result: <span id="result" /></div>';

    document.body.insertAdjacentHTML("afterbegin", fixture);
  });

  // remove the html fixture from the DOM
  afterEach(function () {
    document.body.removeChild(document.getElementById("fixture"));
  });

  // call the init function of calculator to register DOM elements
  beforeEach(function () {
    window.calculator.init();
  });

  it("should return 3 for 1 + 2", function () {
    document.getElementById("payload").value = "test";
    document.getElementById("y").value = 2;
    document.getElementById("add").click();
    expect(document.getElementById("result").innerHTML).toBe("3");
  });
});
