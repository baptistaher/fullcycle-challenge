
<?php

interface Movie 
{
  public function play();

  public function increaseVolume();
}

class TheLionKing implements Movie {
  public function play()
  {}


  public function increaseVolume()
  {}
}

class ModerTimes implements Movie {

  public function play(){
    // play the movie
  }

  public function increaseVolume()
  {
    // this method will not be implemented
  }
}