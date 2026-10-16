package com.campusconnect.rag;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RagService {
 private final CampusDocumentRepository docs;
 private final DocumentChunkRepository chunks;
 private final String baseUrl, apiKey, embeddingModel;
 private final RestClient client = RestClient.builder().build();
 public RagService(CampusDocumentRepository d, DocumentChunkRepository c,
     @Value("${app.ai.base-url:}") String baseUrl,
     @Value("${app.ai.api-key:}") String apiKey,
     @Value("${app.ai.embedding-model:}") String embeddingModel) {
   this.docs=d; this.chunks=c; this.baseUrl=baseUrl; this.apiKey=apiKey; this.embeddingModel=embeddingModel;
 }
 @Transactional
 public CampusDocument ingest(String title,String filename,String text,com.campusconnect.user.User uploader) {
   if(text==null||text.isBlank()) throw new IllegalArgumentException("The uploaded file contains no readable text");
   if(text.length()>500000) throw new IllegalArgumentException("Document exceeds the 500,000 character limit");
   var d=docs.save(new CampusDocument(title,filename,uploader));
   String normalized=text.replace("\r"," ").replaceAll("[\t ]+"," ");
   int size=1800, overlap=200, index=0;
   for(int start=0;start<normalized.length();start+=size-overlap) {
     String part=normalized.substring(start,Math.min(normalized.length(),start+size)).trim();
     if(!part.isBlank()) { var chunk=new DocumentChunk(d,index++,part); var vector=embed(part); if(vector!=null)chunk.setEmbedding(encode(vector)); chunks.save(chunk); }
     if(start+size>=normalized.length()) break;
   }
   return d;
 }
 public List<Map<String,Object>> list() {
   return docs.findAllByOrderByUploadedAtDesc().stream().map(d->Map.<String,Object>of("id",d.getId(),"title",d.getTitle(),"originalName",d.getOriginalName(),"uploadedBy",d.getUploadedBy().getName(),"uploadedAt",d.getUploadedAt())).toList();
 }
 @Transactional public void delete(Long id) {
   var d=docs.findById(id).orElseThrow(()->new IllegalArgumentException("Document not found"));
   chunks.deleteAll(chunks.findByDocumentIdOrderByChunkIndex(id)); docs.delete(d);
 }
 public List<Map<String,Object>> retrieve(String query,int limit) {
   Set<String> queryTerms=terms(query);
   var all=chunks.findAll(); var queryVector=embed(query);
   boolean vectorMode=queryVector!=null && all.stream().anyMatch(c->c.getEmbedding()!=null&&!c.getEmbedding().isBlank());
   if(queryTerms.isEmpty()&&!vectorMode)return List.of();
   return all.stream().map(c->{
     double score;
     if(vectorMode) score=c.getEmbedding()!=null&&!c.getEmbedding().isBlank()?cosine(queryVector,decode(c.getEmbedding())):0;
     else {Set<String> words=terms(c.getContent());long overlap=words.stream().filter(queryTerms::contains).count();score=overlap/(double)Math.max(1,queryTerms.size());}
     return Map.entry(c,score);
   }).filter(e->e.getValue()>0).sorted((a,b)->Double.compare(b.getValue(),a.getValue())).limit(limit)
     .map(e->Map.<String,Object>of("documentId",e.getKey().getDocument().getId(),"title",e.getKey().getDocument().getTitle(),"chunkIndex",e.getKey().getChunkIndex(),"score",Math.round(e.getValue()*1000)/1000.0,"content",e.getKey().getContent())).toList();
 }
 @SuppressWarnings("rawtypes") private double[] embed(String input) {
   if(baseUrl==null||baseUrl.isBlank()||apiKey==null||apiKey.isBlank()||embeddingModel==null||embeddingModel.isBlank())return null;
   try {
     Map response=client.post().uri(baseUrl.replaceAll("/+$","")+"/embeddings").contentType(MediaType.APPLICATION_JSON).headers(h->h.setBearerAuth(apiKey)).body(Map.of("model",embeddingModel,"input",input)).retrieve().body(Map.class);
     List data=(List)response.get("data"); Map first=(Map)data.get(0); List values=(List)first.get("embedding"); double[] out=new double[values.size()]; for(int i=0;i<values.size();i++)out[i]=((Number)values.get(i)).doubleValue(); return out;
   } catch(Exception ignored) { return null; }
 }
 private String encode(double[] v){StringJoiner j=new StringJoiner(",");for(double x:v)j.add(Double.toString(x));return j.toString();}
 private double[] decode(String s){try{return Arrays.stream(s.split(",")).mapToDouble(Double::parseDouble).toArray();}catch(Exception e){return new double[0];}}
 private double cosine(double[] a,double[] b){if(a.length==0||a.length!=b.length)return 0;double dot=0,aa=0,bb=0;for(int i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return aa==0||bb==0?0:dot/(Math.sqrt(aa)*Math.sqrt(bb));}
 private Set<String> terms(String s){return Pattern.compile("[^a-z0-9]+").splitAsStream(s.toLowerCase(Locale.ROOT)).filter(x->x.length()>2&&!Set.of("the","and","for","are","with","that","this","you","your","from","was","were","has","have","can","will","not","but","all","any","our","their","into","how","what","when","where","why","who","which","does","about").contains(x)).collect(Collectors.toSet());}
}
