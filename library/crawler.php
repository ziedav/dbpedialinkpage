<?php
    include_once ('page.php');
    
    class Crawler{
        
		public function __construct(){
			
		}
		
		/**
		 * 
		 * @return DOMDocument
		 */
		public function getPageDocument($url, $name = '') {
			return Page::factory($url, $name)->removeScripts()->removeTags('img', true)->factoryDocument()->getDocument();
		}
    }
    
    class WikiCrawler extends Crawler{
        
        public function __construct() {
            parent::__construct();
        }
        
        public function getTextNodes($doc, $minLength = 200){
            $path = new DOMXpath($doc);
            $textNodes = $path->query('//text()');
            $result = [];
            
            foreach ($textNodes as $node){
                if($node->length >= $minLength){
                    $result[] = utf8_decode($node->textContent);
                }
            }
            //print_r($result);exit;
            return $result;
        }
        
        public function serialize($textNodes){
            $obj = new stdClass();
            $serialized = [];
            foreach ($textNodes as $node){
                $obj = new stdClass();
                $obj->text = $node;
                $serialized[] = $obj;
            }
            
            return json_encode($serialized);
        }
    }
?>