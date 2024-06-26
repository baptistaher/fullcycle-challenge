
<?php

class Video 
{
  private $type; 

  public function calculeInteress()
  {
    if($this->type == "Movie") {
      // calcule do filme
    } elseif ($this->type == "TVShow") {
      // calcule da TVShow
    }
  }
}