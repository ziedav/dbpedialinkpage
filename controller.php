<?php
    include_once ('\library\crawler.php');
    
    $crawler = new WikiCrawler();
    $document = $crawler->getPageDocument($_REQUEST['url'], 'name');
    $textNodes = $crawler->getTextNodes($document);
    
    echo $crawler->serialize($textNodes);
?>
