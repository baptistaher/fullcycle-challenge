

<?php 


class DramaCategory{}



class Movie {

 private $name;
 private $category;
 
 public function getName() {
  return $this->name;
 }


 public function setName($name) {
  $this->Name = $name;
 }


 public function getCategory(){
  // return $this->category;
  return new DramaCategory();
 }

}