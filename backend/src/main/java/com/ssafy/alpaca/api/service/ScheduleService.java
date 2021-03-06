package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ProblemListRes;
import com.ssafy.alpaca.api.response.ScheduleRes;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.api.response.UserListRes;
import com.ssafy.alpaca.common.exception.UnAuthorizedException;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.*;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final MyStudyRepository myStudyRepository;
    private final ScheduleRepository scheduleRepository;
    private final ToSolveProblemRepository toSolveProblemRepository;
    private final SolvedProblemRepository solvedProblemRepository;
    private final ProblemRepository problemRepository;
    private final CodeRepository codeRepository;
    private final ConvertUtil convertUtil;

    private Schedule checkScheduleById(Long id) {
        return scheduleRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND)
        );
    }

    private void checkIsStudyMember(User user, Study study)  {
        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }
    }

    private List<ProblemListRes> getProblemListByToSolveProblems(User user, List<ToSolveProblem> toSolveProblems, List<MyStudy> myStudies) {
        List<ProblemListRes> problemListResList = new ArrayList<>();
        HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(user.getId());
        for (ToSolveProblem toSolveProblem : toSolveProblems) {
            Problem problem = problemRepository.findByProblemNumber(toSolveProblem.getProblemNumber()).orElseThrow(
                    () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)
            );

            List<UserListRes> userListRes = new ArrayList<>();
            for (MyStudy myStudy : myStudies) {
                if (Boolean.TRUE.equals(codeRepository.existsByProblemNumberAndUserId(problem.getProblemNumber(), myStudy.getUser().getId()))) {
                    userListRes.add(
                            UserListRes.builder()
                                    .id(myStudy.getUser().getId())
                                    .nickname(myStudy.getUser().getNickname())
                                    .profileImg(convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                                    .build()
                    );
                }
            }

            problemListResList.add(
                    ProblemListRes.builder()
                            .problemNumber(problem.getProblemNumber())
                            .title(problem.getTitle())
                            .level(problem.getLevel())
                            .isSolved(solvedProblems.contains(problem.getProblemNumber()))
                            .solvedMemberList(userListRes)
                            .build()
            );
        }
        return problemListResList;
    }

    private void timeValidationCheck(OffsetDateTime a, OffsetDateTime b) {
        LocalDateTime finishedAt = LocalDateTime.of(
                a.getYear(), a.getMonth(), a.getDayOfMonth(), a.getHour(), a.getMinute()
        );
        LocalDateTime startedAt = LocalDateTime.of(
                b.getYear(), b.getMonth(), b.getDayOfMonth(), b.getHour(), b.getMinute()
        );
        if (finishedAt.isBefore(startedAt)) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_DATE_VALUE);
        }
    }

    private OffsetDateTime getThisMonth(OffsetDateTime a, String offset) {
        return OffsetDateTime.of(LocalDateTime.of(
                a.getYear(), a.getMonth(), a.getDayOfMonth(), 0, 0
        ), ZoneOffset.of(offset));
    }

    public Long createSchedule(User user, Study study, ScheduleReq scheduleReq) {
        timeValidationCheck(scheduleReq.getFinishedAt(), scheduleReq.getStartedAt());
        checkIsStudyMember(user, study);
        OffsetDateTime offsetDateTime = getThisMonth(scheduleReq.getStartedAt(), "Z");

        if (Boolean.TRUE.equals(scheduleRepository.existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, offsetDateTime, offsetDateTime.plusDays(1)))
        ) {
            throw new NullPointerException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

        Schedule schedule = Schedule.builder()
                        .study(study)
                        .startedAt(scheduleReq.getStartedAt())
                        .finishedAt(scheduleReq.getFinishedAt())
                        .build();
        List<ToSolveProblem> toSolveProblems = new ArrayList<>();
        for (Long number : scheduleReq.getToSolveProblems()) {
            toSolveProblems.add(
                    ToSolveProblem.builder()
                            .schedule(schedule)
                            .problemNumber(number)
                            .build()
            );
        }

        scheduleRepository.save(schedule);
        toSolveProblemRepository.saveAll(toSolveProblems);
        return schedule.getId();
    }

    public ScheduleRes getTodaySchedule(User user, Study study, Integer offset) {
        checkIsStudyMember(user, study);
        String offSet = convertUtil.getTime(offset);

        LocalDateTime localDateTime = LocalDateTime.now();
        OffsetDateTime today = OffsetDateTime.of(LocalDateTime.of(
                localDateTime.getYear(),
                localDateTime.getMonth(),
                localDateTime.getDayOfMonth(), 0, 0), ZoneOffset.of(offSet));
        Optional<Schedule> todaySchedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, today, today.plusDays(1));

        if (todaySchedule.isEmpty()) {
            throw new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND);
        }

        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);
        List<ToSolveProblem> toSolveProblem = toSolveProblemRepository.findAllBySchedule(todaySchedule.get());
        List<ProblemListRes> problemListRes = getProblemListByToSolveProblems(user, toSolveProblem, myStudies);

        return ScheduleRes.builder()
                .startedAt(todaySchedule.get().getStartedAt())
                .finishedAt(todaySchedule.get().getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public void updateSchedule(User user, Long id, ScheduleUpdateReq scheduleUpdateReq) {
        timeValidationCheck(scheduleUpdateReq.getFinishedAt(), scheduleUpdateReq.getStartedAt());
        Schedule schedule = checkScheduleById(id);
        Study study = schedule.getStudy();
        OffsetDateTime offsetDateTime = getThisMonth(scheduleUpdateReq.getStartedAt(), "Z");

        Optional<Schedule> checkSchedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, offsetDateTime, offsetDateTime.plusDays(1));

        if (checkSchedule.isEmpty() || !schedule.getId().equals(checkSchedule.get().getId())) {
            throw new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND);
        }

        checkIsStudyMember(user, study);

        schedule.setStartedAt(scheduleUpdateReq.getStartedAt());
        schedule.setFinishedAt(scheduleUpdateReq.getFinishedAt());
        scheduleRepository.save(schedule);
        HashSet<Long> originProblems = toSolveProblemRepository.findProblemNumbersByScheduleId(schedule.getId());
        HashSet<Long> newProblems = new HashSet<>(scheduleUpdateReq.getToSolveProblems());

        List<ToSolveProblem> saveList = new ArrayList<>();
        List<ToSolveProblem> deleteList = new ArrayList<>();

        for (Long originProblem : originProblems) {
            if (newProblems.contains(originProblem)) {
                continue;
            }
            toSolveProblemRepository.findByScheduleAndProblemNumber(schedule, originProblem).ifPresent(deleteList::add);
        }

        for (Long newProblem : newProblems) {
            if (originProblems.contains(newProblem)) {
                continue;
            }
            saveList.add(ToSolveProblem.builder()
                    .schedule(schedule)
                    .problemNumber(newProblem)
                    .build());
        }

        toSolveProblemRepository.saveAll(saveList);
        toSolveProblemRepository.deleteAll(deleteList);
    }

    public ScheduleRes getSchedule(User user, Long id) {
        Schedule schedule = checkScheduleById(id);
        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(schedule.getStudy());
        List<ToSolveProblem> toSolveProblem = toSolveProblemRepository.findAllBySchedule(schedule);
        List<ProblemListRes> problemListRes = getProblemListByToSolveProblems(user, toSolveProblem, myStudies);

        return ScheduleRes.builder()
                .startedAt(schedule.getStartedAt())
                .finishedAt(schedule.getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public List<ScheduleListRes> getScheduleList(User user, Study study, Integer year, Integer month, Integer day) {
        checkIsStudyMember(user, study);

        if (day == null) {
            OffsetDateTime offsetDateTime = OffsetDateTime.of(year, month, 1, 0, 0, 0, 0, ZoneOffset.of("Z"));
            if (offsetDateTime.getDayOfWeek().getValue() < 7) {
                offsetDateTime = offsetDateTime.minusDays(offsetDateTime.getDayOfWeek().getValue());
            }
            return ScheduleListRes.of(scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                    study, offsetDateTime, offsetDateTime.plusWeeks(6)));
        } else {
            OffsetDateTime offsetDateTime = OffsetDateTime.of(year, month, day, 0, 0, 0, 0, ZoneOffset.of("Z"));
            if (offsetDateTime.getDayOfWeek().getValue() < 7) {
                offsetDateTime = offsetDateTime.minusDays(offsetDateTime.getDayOfWeek().getValue());
            }
            return ScheduleListRes.of(scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                    study, offsetDateTime, offsetDateTime.plusDays(7)));
        }
    }

    public void deleteSchedule(User user, Long id) {
        Schedule schedule = checkScheduleById(id);
        Study study = schedule.getStudy();

        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        scheduleRepository.delete(schedule);
    }
}
