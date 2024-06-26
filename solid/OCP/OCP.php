
<?php


abstract class Video {
  abstract public function calculeInteress();
}


class Movie extends Video 
{
  public function calculeInteress()
  {
    // calcule do filme
  }
}


class TVShow extends Video 
{
  public function calculeInteress()
  {
    // calcule da TVShow
  }
}
