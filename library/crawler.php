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
        private static $htmlEntitiesToAvoid = ['&nbsp;'];
        
        public function __construct() {
            parent::__construct();
        }
        
        public function getTextNodes($doc, $minLength = 200){
            $path = new DOMXpath($doc);
            //$textNodes = $path->query('//text()');
            $textNodes = $path->query('//body//p');
            $result = array();
            foreach ($textNodes as $node){
                if(strlen($node->nodeValue) >= $minLength){
                    //$result[] = $this->decode($node->nodeValue);
                    $result[] = $node->nodeValue;
                }
            }
            
            return $result;
        }
        
        private function decode($str){
            $str = html_entity_decode(str_replace(WikiCrawler::$htmlEntitiesToAvoid, '', htmlentities($str)));
            //return mb_convert_encoding($str, 'ISO-8859-1', mb_detect_encoding($str));
            return utf8_decode($str);
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