package com.swp391.mapper;
import com.swp391.dto.request.FeedbackRequest;
import com.swp391.dto.response.FeedbackResponse;
import com.swp391.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FeedBackMapper {
    @Mapping(target = "member", ignore = true)
    Feedback toFeedback(FeedbackRequest request);

    @Mapping(source = "member", target = "member")
    FeedbackResponse toFeedbackResponse(Feedback feedback);

    void updateFeedback(@MappingTarget Feedback feedback, FeedbackRequest request);
}
