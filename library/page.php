<?php
	class Page{
		public $url = "";
        
		public $name = "";
        
		public $content = "";
		
		public $fragment = "";
		
		public $document = null;
		
		public function __construct($url = "", $name = ""){
			$this->url = $url;
            $this->name = $name;
		}
		
		public static function factory($url, $name){
			$tmp = new Page($url, $name);
			$tmp->requestContent();
			return $tmp;
		}
		
		private function requestContent(){
			$ch = curl_init();

		    curl_setopt ($ch, CURLOPT_URL, $this->url);
		    curl_setopt ($ch, CURLOPT_HEADER, 0);
		    curl_setopt ($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17');
		
		    ob_start();
		
		    curl_exec ($ch);
		    curl_close ($ch);
		    $string = ob_get_contents();
		
		    ob_end_clean();
		    
		    $this->content = $string;
		    
		    sleep(1);
		    return $string;     
		}
		
		/**
		 * 
		 * @return Page
		 */
		public function removeScripts(){
			return $this->removeTags("script");
		}
		
		public function removeTags($tagName, $noClose = false) {
			$content = $this->fragment;
			if(empty($content)) $content = $this->content;
			
			if($noClose){
				$pattern[0] = '/<'.$tagName.'[^>]*>/msi';
				$pattern[1] = '/<\/'.$tagName.'[^>]*>/msi';
				$replace = array("", "");
			}else{
				$pattern = '/<'.$tagName.'[^>]*>.*?<\/'.$tagName.'>/msi';
				$replace = "";
			}
			
			
			$content = preg_replace($pattern, $replace, $content);
			$this->fragment = $content;
			
			return $this;
		}
		
		/**
		 * 
		 * @return Page
		 */
		public function factoryDocument(){
			$doc = new DOMDocument();
            @$doc->loadHTML($this->fragment);
			$this->document = $doc;
			return $this;
		}
		
		/**
		 * 
		 * @return DOMDocument
		 */
		public function getDocument(){
			return $this->document;
		}
		
		public function getFragment(){
			return $this->fragment;
		}
		
		public function toString(){
			$return = $this->fragment;
			if (empty($return)) $return = $this->content;
			
			$return = str_replace("<", "&lt;", $return);
			$return = str_replace(">", "&gt;", $return);
			
			return $return;
		}
		
         /**
		 * 
		 * @return Page
		 */
		public function extractFirstDiv(){
			$content = $this->fragment;
			if(empty($content)) $content = $this->content;
			
			$posStart = strpos($content, "<div");
			
			$contentReverse = strrev($content);
			
			$tmpPos = strpos($contentReverse, ">vid/<");
			
			$posLength = strlen($contentReverse) - $tmpPos - $posStart;
			
			$this->fragment = substr($content, $posStart, $posLength);
				
			return $this;
		}
		
		/**
		 * @param String $tagname 
		 * @param String $classname
		 * @return DOMNodeList that contains all tags specified by tagname and classname
		 */
		public function getElementsByClassName($tagname, $classname){
			if ($this->document == null) $this->factoryDocument();
			$xpath = new DOMXPath($this->document);
			return $xpath->query('//'.$tagname.'[contains(attribute::class, "'.$classname.'")]');
		}
		
		/**
		 * 
		 * Enter description here ...
		 * @param String $tagname
		 * @param StringArray $classnames
		 * @return Array nodelists that contains all DOMNodeList's each returned by own methode getElementsByClassName($tagname, $classname)
		 */
		public function getElementsByClassNameArray($tagname, $classnames){		
			$nodelists = array();			
			foreach($classnames as $classname){
				$nodelists[] = $this->getElementsByClassName($tagname, $classname);
			}
			return $nodelists;
		}
	}
?>
