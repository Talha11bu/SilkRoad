package com.talha11bu.silkroad;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talha11bu.silkroad.repo.SessionRepo;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SessionControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private S3Presigner s3Presigner;

	@Autowired
	private SessionRepo sessionRepository;

	@Test
	void createSessionAndRequestUploadUrl() throws Exception {
		PresignedPutObjectRequest mockPut = Mockito.mock(PresignedPutObjectRequest.class);
		Mockito.when(mockPut.url()).thenReturn(URI.create("http://localhost:4566/silkroad-local/mock-put").toURL());
		Mockito.when(s3Presigner.presignPutObject(Mockito.any(PutObjectPresignRequest.class)))
				.thenReturn(mockPut);

		MvcResult createResult = mockMvc.perform(post("/sessions/create")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"password":"secret","duration":"PT10M"}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.host").value(true))
				.andExpect(jsonPath("$.session.userCount").value(1))
				.andReturn();

		JsonNode json = objectMapper.readTree(createResult.getResponse().getContentAsString());
		String token = json.get("token").asText();
		String sessionId = json.get("session").get("sessionId").asText();

		assertTrue(sessionRepository.existsById(sessionId));

		mockMvc.perform(get("/sessions/{id}/upload-url", sessionId)
						.param("fileName", "resume.pdf")
						.param("contentType", "application/pdf"))
				.andExpect(status().isUnauthorized());

		MvcResult uploadUrlResult = mockMvc.perform(get("/sessions/{id}/upload-url", sessionId)
						.param("fileName", "resume.pdf")
						.param("contentType", "application/pdf")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.url").value("http://localhost:4566/silkroad-local/mock-put"))
				.andReturn();

		JsonNode uploadJson = objectMapper.readTree(uploadUrlResult.getResponse().getContentAsString());
		assertEquals("http://localhost:4566/silkroad-local/mock-put", uploadJson.get("url").asText());
	}
}
