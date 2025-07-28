package com.pixelforge.repository;




import com.pixelforge.entity.MFAOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MFAOtpRepository extends JpaRepository<MFAOtp, Long> {
    Optional<MFAOtp> findByEmail(String email);

}
