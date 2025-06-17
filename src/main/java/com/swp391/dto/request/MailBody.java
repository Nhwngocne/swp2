package com.swp391.dto.request;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {

}
