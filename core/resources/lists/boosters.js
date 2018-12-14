boosters={
  doki:{},
}

module.exports = {
  
  color : function (id){
  return (boosters[id]||{color:"#b33ae0"}).color;
}

  
  
}