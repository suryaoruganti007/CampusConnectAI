package com.campusconnect.rag;
import jakarta.persistence.*;
@Entity @Table(name="document_chunks",indexes=@Index(name="idx_chunk_document",columnList="document_id"))
public class DocumentChunk {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private CampusDocument document;
 @Column(nullable=false) private Integer chunkIndex;
 @Column(nullable=false,length=6000) private String content;
 @Column(columnDefinition="TEXT") private String embedding;
 protected DocumentChunk(){}
 public DocumentChunk(CampusDocument d,int i,String c){document=d;chunkIndex=i;content=c;}
 public Long getId(){return id;} public CampusDocument getDocument(){return document;} public Integer getChunkIndex(){return chunkIndex;} public String getContent(){return content;} public String getEmbedding(){return embedding;} public void setEmbedding(String value){embedding=value;}
}
