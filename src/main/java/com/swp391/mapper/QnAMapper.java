package com.swp391.mapper;

import com.swp391.dto.request.QnAQuestionRequest;
import com.swp391.dto.response.QnAResponse;
import com.swp391.entity.QnA;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {MemberMapper.class, StaffMapper.class})
public interface QnAMapper {

    // Tạo QnA entity từ request
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answer", ignore = true)
    @Mapping(target = "answeredAt", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    QnA toQnA(QnAQuestionRequest request);

    // Tạo response từ entity (gồm cả member/staff object)
    QnAResponse toQnAResponse(QnA qna);

    // Cập nhật lại thông tin câu hỏi nếu cần
    @Mapping(target = "answer", ignore = true)
    @Mapping(target = "answeredAt", ignore = true)
    @Mapping(target = "member", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateQnA(@MappingTarget QnA entity, QnAQuestionRequest request);
}
